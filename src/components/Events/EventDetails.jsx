import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../utils/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const navigate = useNavigate();

  const { id } = useParams();

  const {
    data: event,
    isPending: isPendingEvent,
    isError: isErrorEvent,
    error: eventError,
  } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
  });

  const { mutate: deleteEv } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none',
      });
      navigate('/events');
    },
  });

  function handleDelete() {
    deleteEv({ id });
  }

  if (isPendingEvent) {
    return (
      <div id='event-details-content' className='center'>
        <LoadingIndicator />
      </div>
    );
  }

  if (isErrorEvent) {
    return (
      <div id='event-details-content' className='center'>
        <ErrorBlock
          title='An error occurred'
          message={eventError.info?.message || 'Failed to fetch event'}
        />
      </div>
    );
  }

  const formattedDate = new Date(event?.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <Outlet />
      <Header>
        <Link to='/events' className='nav-item'>
          View all Events
        </Link>
      </Header>
      <article id='event-details'>
        {event && (
          <>
            <header>
              <h1>{event.title}</h1>
              <nav>
                <button onClick={handleDelete}>Delete</button>
                <Link to='edit'>Edit</Link>
              </nav>
            </header>
            <div id='event-details-content'>
              <img
                src={`http://localhost:3000/${event.image}`}
                alt='event image'
              />
              <div id='event-details-info'>
                <div>
                  <p id='event-details-location'> {event.location}</p>
                  <time dateTime={`Todo-DateT$Todo-Time`}>
                    {formattedDate} @ {event.time}
                  </time>
                </div>
                <p id='event-details-description'>{event.description}</p>
              </div>
            </div>
          </>
        )}
      </article>
      
    </>
  );
}
