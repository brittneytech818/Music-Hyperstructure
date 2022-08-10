import { Input } from 'degen'
import { useFormContext } from 'react-hook-form'

const FormInput = ({ id, label, min, placeholder, step, suffix, type }) => {
	const { register } = useFormContext()

	return (
		<Input
			width={{ md: '180' }}
			id={id}
			label={label}
			min={min}
			placeholder={placeholder}
			step={step}
			suffix={suffix}
			type={type}
			{...register(id)}
		/>
	)
}

export default FormInput
