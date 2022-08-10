import { Button, IconChevronDown, IconChevronRight, Stack } from 'degen'
import { useState } from 'react'
import MintAdvancedFormFields from '@/components/MintAdvancedFormFields'

const Accordion = () => {
	const [open, setOpen] = useState()

	const handleClick = e => {
		e.preventDefault()
		setOpen(!open)
	}
	return (
		<>
			<Button variant="secondary" width="full" onClick={handleClick}>
				<Stack direction="horizontal">
					advanced music metadata {open ? <IconChevronDown /> : <IconChevronRight />}
				</Stack>
			</Button>
			{open && <MintAdvancedFormFields />}
		</>
	)
}

export default Accordion
