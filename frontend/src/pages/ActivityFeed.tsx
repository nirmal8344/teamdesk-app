import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import { Activity, User } from '../types';
import { NoteIcon, EmailIcon, CallIcon, MeetingIcon } from '../components/icons/Icons';
import * as api from '../services/api';

const ActivityTypeIcon: React.FC<{type: Activity['type']}> = ({ type }) => {
    const icons = {
        note: <NoteIcon className="w-5 h-5 text-yellow-500" />,
        email: <EmailIcon className="w-5 h-5 text-blue-500" />,
        call: <CallIcon className="w-5 h-5 text-green-500" />,
        meeting: <MeetingIcon className="w-5 h-5 text-purple-500" />,
    };
    const colors = {
        note: 'bg-yellow-500/10',
        email: 'bg-blue-500/10',
        call: 'bg-green-500/10',
        meeting: 'bg-purple-500/10',
    }

    return (
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${colors[type]}`}>
          {icons[type]}
      </div>
    );
}

const ActivitySkeleton: React.FC = () => (
    <div className="flex items-start space-x-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0"></div>
        <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="h-3 bg-muted rounded w-1/4"></div>
        </div>
    </div>
);


const ActivityFeed: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setIsLoading(true);
                const data = await api.getActivityFeed();
                setActivities(data);
            } catch (err) {
                setError('Failed to load activity feed.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchActivities();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return Array.from({ length: 5 }).map((_, i) => <ActivitySkeleton key={i} />);
        }
        if (error) {
            return <p className="text-center text-destructive">{error}</p>;
        }
        return activities.map(activity => (
            <div key={activity.id} className="flex items-start space-x-4">
                <ActivityTypeIcon type={activity.type} />
                <div>
                    <div className="flex items-center space-x-2">
                        <img src={activity.author.avatar} alt={activity.author.name} className="w-6 h-6 rounded-full" />
                        <p className="text-sm">
                            <span className="font-semibold text-foreground">{activity.author.name}</span>
                            <span className="text-muted-foreground"> logged a {activity.type}</span>
                        </p>
                    </div>
                    <p className="mt-1 text-foreground">{activity.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(activity.date).toLocaleString()}</p>
                </div>
            </div>
        ));
    };

  return (
    <div>
      <h1 className="text-3xl font-bold font-display text-foreground mb-8">Realtime Activity Feed</h1>
      <Card>
        <div className="space-y-8">
            {renderContent()}
        </div>
      </Card>
    </div>
  );
};

export default ActivityFeed;
