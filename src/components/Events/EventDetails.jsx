import { Link, Outlet, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchEvent } from '../../utils/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventDetails() {
  const { id } = useParams();

  console.log(id);

  const {
    data: event,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ['event'],
    queryFn: () => fetchEvent({ id }),
  });

  if (isPending) {
    <LoadingIndicator />;
  }

  if (isError) {
    <ErrorBlock
      title='An error occurred'
      message={error.info?.message || 'Failed to fetch event'}
    />;
  }

  console.log(event);

  return (
    <>
      <Outlet />
      <Header>
        <Link to='/events' className='nav-item'>
          View all Events
        </Link>
      </Header>
      {event && (
        <article id='event-details'>
          <header>
            <h1>{event.title}</h1>
            <nav>
              <button>Delete</button>
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
                  {event.date} at {event.time}
                </time>
              </div>
              <p id='event-details-description'>{event.description}</p>
            </div>
          </div>
        </article>
      )}
    </>
  );
}
