import type { Meta, StoryObj } from '@storybook/react';
import { withRedux } from '@/.storybook/decorators';
import { EventCard } from '../components/events/event-card';

const meta: Meta<typeof EventCard> = {
  title     : 'Events/EventCard',
  component : EventCard,
  parameters: { layout: 'centered' },
  tags      : ['autodocs'],
  decorators: [
    withRedux,
    Story => (
      <div className="w-[400px]">
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof EventCard>;

const sampleEvent = {
  id           : '1',
  title        : 'React Meetup: Building Modern Web Apps',
  category     : 'Technology',
  startsAt     : new Date('2025-12-15T18:00:00'),
  venueName    : 'Tech Hub Downtown',
  rsvpCount    : 45,
  waitListCount: 12,
  price        : '$15',
  imageUrl     : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop'
};

export const Default: Story = { args: { event: sampleEvent } };

export const WithoutImage: Story = {
  args: {
    event: {
      ...sampleEvent,
      imageUrl: undefined
    }
  }
};

export const MinimalInfo: Story = {
  args: {
    event: {
      id      : '2',
      title   : 'Simple Event with Minimal Information',
      startsAt: new Date('2025-12-20T19:00:00')
    }
  }
};

export const LongTitle: Story = {
  args: {
    event: {
      ...sampleEvent,
      title: 'This is a Very Long Event Title That Should Be Truncated to Two Lines Maximum to Maintain the Card Layout'
    }
  }
};

export const HighRSVP: Story = {
  args: {
    event: {
      ...sampleEvent,
      rsvpCount    : 250,
      waitListCount: 75
    }
  }
};

export const Free: Story = {
  args: {
    event: {
      ...sampleEvent,
      price: 'Free'
    }
  }
};
