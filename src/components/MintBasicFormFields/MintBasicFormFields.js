import FormInput from '@/components/FormInput'
import { MediaPicker } from '@/components/MediaPicker.tsx'
import Accordion from '@/components/Accordion'
import { FieldSet, Textarea } from 'degen'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useAccount, useNetwork } from 'wagmi'

const MintBasicFormFields = () => {
	const { register, setValue } = useFormContext()
	const { chain } = useNetwork()
	const { address } = useAccount()

	useEffect(() => {
		register('image')
		register('song')
	}, [register])

	return (
		<FieldSet legend="Create a song">
			<FormInput id="name" label="Song title" placeholder="Keep it Heady" />
			<Textarea id="description" label="Description" {...register('description')}></Textarea>
			<FormInput
				id="askPrice"
				label="Ask Price"
				step="0.000001"
				placeholder="0.01"
				suffix={chain?.nativeCurrency?.symbol}
				type="number"
			/>

			<FormInput
				id="findersFeeBps"
				label="Finder's Fee"
				step="1"
				placeholder="5"
				min={0}
				suffix="%"
				type="number"
			/>
			<MediaPicker
				id="song"
				compact
				maxSize={20}
				accept="audio/wav"
				label="Upload your sound"
				onError={console.error}
				onChange={e => {
					setValue('song', e)
				}}
				name="song"
			/>
			<MediaPicker
				id="image"
				compact
				accept="image/jpeg, image/png, image/webp, image/gif"
				label="Cover image"
				onError={console.error}
				onChange={e => {
					setValue('image', e)
				}}
			/>

			<FormInput
				id="sellerFundsRecipient"
				description="The address that will receive any withdrawals and royalties. It can be your personal wallet, a multisignature wallet, or an external splits contract."
				label="Seller fund recipient"
				placeholder={address ?? '0xA0Cf…251e'}
			/>
			<Accordion />
		</FieldSet>
	)
}

export default MintBasicFormFields
