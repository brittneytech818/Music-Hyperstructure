import FormInput from '@/components/FormInput'

const MintAdvancedFormFields = () => {
	return (
		<>
			<FormInput
				id="duration"
				label="Duration (seconds)"
				step={1}
				min={0}
				type="number"
				placeholder="Length of the audio file in seconds"
			/>
		</>
	)
}

export default MintAdvancedFormFields
