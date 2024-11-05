import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../utils/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);

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

  const {
    mutate: deleteEv,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none',
      });
      navigate('/events');
    },
  });

  function handleStartDelete() {
    setIsDeleting(true);
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

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
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure?</h2>
          <p>
            Do you really want to delete this event? This action cannot be
            undone.
          </p>
          <div className='form-actions'>
            {isPendingDeletion && <p>Deleting, please wait...</p>}
            {!isPendingDeletion && (
              <>
                <button onClick={handleStopDelete} className='button-text'>
                  Cancel
                </button>
                <button onClick={handleDelete} className='button'>
                  Delete
                </button>
              </>
            )}
          </div>
          {isErrorDeleting && (
            <ErrorBlock
              title='Failed to delete event'
              message={
                deleteError.info?.message ||
                'Failed to delete event. Please try again later!'
              }
            />
          )}
        </Modal>
      )}
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
                <button onClick={handleStartDelete}>Delete</button>
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
