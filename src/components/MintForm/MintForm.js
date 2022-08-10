import React, { useState } from 'react'
import { Box, Stack } from 'degen'
import { useForm, FormProvider } from 'react-hook-form'
import { useAccount, useContract, useNetwork, useSigner } from 'wagmi'
import { NFTStorage } from 'nft.storage'
import { utils } from 'ethers'
import MintSongButton from '@/components/MintSongButton'
import MintBasicFormFields from '@/components/MintBasicFormFields'
import contractInterface from '@/abi/factory-abi.json'
import moduleManagerContractInterface from '@/abi/module-manager-abi.json'
import createMusicMetadata from '@/utils/createMusicMetadata'
import getZoraAsksV1_1Address from '@/utils/getZoraAsksV1_1Address'
import { toast } from 'react-toastify'

const MintForm = ({ contractAddress, moduleManagerContractAddress }) => {
	const { address } = useAccount()
	const [loading, setLoading] = useState(false)
	const { data: signer } = useSigner()
	const { chain } = useNetwork()
	const factoryContract = useContract({
		addressOrName: contractAddress,
		contractInterface: contractInterface,
		signerOrProvider: signer,
	})
	const moduleManagerContract = useContract({
		addressOrName: moduleManagerContractAddress,
		contractInterface: moduleManagerContractInterface,
		signerOrProvider: signer,
	})
	// todo: form validation
	const methods = useForm()

	const onSubmit = async data => {
		setLoading(true)
		data.address = address
		console.log(data)
		const metadata = createMusicMetadata(data, address)
		const client = new NFTStorage({ token: process.env.NEXT_PUBLIC_API_KEY })
		const ipfs = await client.store(metadata)

		console.log(ipfs.url)
		toast.success(
			<a href={ipfs.url} target="__blank">
				created music metadata. click me to learn more.
			</a>
		)
		// const askPrice = utils.parseEther(data.askPrice || '0').toString()
		// const findersFee = parseInt(data.findersFeeBps || 0) * 100
		// const isApproved = await checkAskModuleApproved()
		// if (!isApproved) {
		// 	setLoading(false)
		// 	return
		// }

		// await deployMusicNft(ipfs.url, metadata.name, data.sellerFundsRecipient, askPrice, findersFee)
		setLoading(false)
	}

	const checkAskModuleApproved = async () => {
		let approved = await moduleManagerContract.isModuleApproved(address, getZoraAsksV1_1Address(chain?.id))

		if (!approved) {
			approved = await moduleManagerContract
				.setApprovalForModule(getZoraAsksV1_1Address(chain?.id), true)
				.then(async tx => {
					await tx.wait()
					return true
				})
				.catch(err => {
					console.error(err)
					return false
				})
		}

		return approved
	}

	const deployMusicNft = async (metadata, curatorName, sellerFundsRecipient, askPrice, findersFee) => {
		await factoryContract
			.createCatalog(curatorName, metadata, askPrice, sellerFundsRecipient || address, findersFee, {
				value: 500000000000000,
			})
			.then(async tx => {
				const receipt = await tx.wait()
			})
			.catch(console.error)
	}

	return (
		<Box justifyContent="center" display="grid" gap="8" marginX="12">
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)}>
					<Stack space="10">
						<MintBasicFormFields />
						<Box marginTop="8">
							<MintSongButton loading={loading} />
						</Box>
					</Stack>
				</form>
			</FormProvider>
		</Box>
	)
}

export default MintForm
