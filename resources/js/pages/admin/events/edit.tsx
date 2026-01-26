import EventForm from './event-form'
import {Event} from '@/types/event';

type Props = {
  event: Event
}

export default function Edit({ event }: Props) {
  return (
        <EventForm event={event} />
  )
}