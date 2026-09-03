import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  CampusIssue,
  IssueCategory,
  IssueStatus,
  NotificationItem,
} from './types';
import { INITIAL_ISSUES, INITIAL_NOTIFICATIONS } from './data/initialData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { IssueDetailModal } from './components/IssueDetailModal';
import { FilterModal } from './components/FilterModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ProfileModal } from './components/ProfileModal';
import { ShareModal } from './components/ShareModal';
import { CampusFeedView } from './views/CampusFeedView';
import { ExploreView } from './views/ExploreView';
import { ReportIssueView } from './views/ReportIssueView';
import { MyReportsView } from './views/MyReportsView';
import { AdminView } from './views/AdminView';

export default function App() {
  const [issues, setIssues] = useState<CampusIssue[]>(() => {
    try {
      const saved = localStorage.getItem('campusvoice_issues');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved issues', e);
    }
    return INITIAL_ISSUES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('campusvoice_notifications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'all'>('all');
  const [selectedZone, setSelectedZone] = useState<string>('All Zones');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'urgency' | 'upvotes' | 'newest'>('urgency');

  // Modals
  const [selectedIssue, setSelectedIssue] = useState<CampusIssue | null>(null);
  const [shareIssue, setShareIssue] = useState<CampusIssue | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusvoice_issues', JSON.stringify(issues));
    } catch (e) {
      console.error('Error saving issues', e);
    }
  }, [issues]);

  useEffect(() => {
    try {
      localStorage.setItem('campusvoice_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Error saving notifications', e);
    }
  }, [notifications]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3000);
  };

  // Upvote toggle
  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === id) {
          const isVoted = !!issue.hasUpvoted;
          const nextCount = isVoted ? issue.upvotes - 1 : issue.upvotes + 1;
          showToast(isVoted ? 'Vote withdrawn' : 'Priority Upvoted! +1');
          return {
            ...issue,
            hasUpvoted: !isVoted,
            upvotes: nextCount,
          };
        }
        return issue;
      })
    );

    // If modal is open for this issue, update it too
    if (selectedIssue && selectedIssue.id === id) {
      setSelectedIssue((prev) =>
        prev
          ? {
              ...prev,
              hasUpvoted: !prev.hasUpvoted,
              upvotes: prev.hasUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
            }
          : null
      );
    }
  };

  // Share action
  const handleShare = (issue: CampusIssue, e: React.MouseEvent) => {
    e.stopPropagation();
    setShareIssue(issue);
  };

  // Add Comment
  const handleAddComment = (issueId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: 'You (North Campus Student)',
      timeAgo: 'Just now',
      text,
    };

    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            comments: [...issue.comments, newComment],
          };
        }
        return issue;
      })
    );

    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, newComment],
            }
          : null
      );
    }

    showToast('Comment posted to issue thread');
  };

  // New Issue creation
  const handleCreateIssue = (
    newIssueData: Omit<CampusIssue, 'id' | 'timestamp' | 'upvotes' | 'comments'>
  ) => {
    const newIssue: CampusIssue = {
      ...newIssueData,
      id: `issue-${Date.now()}`,
      timestamp: Date.now(),
      upvotes: 1,
      hasUpvoted: true,
      comments: [
        {
          id: `c-init-${Date.now()}`,
          author: 'System Bot',
          isOfficial: true,
          timeAgo: 'Just now',
          text: 'Ticket verified & queued for North Campus Facilities Triage.',
        },
      ],
    };

    setIssues((prev) => [newIssue, ...prev]);

    // Create Notification
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Campus Issue Reported',
      message: `Your report "${newIssue.title}" has been registered (#CV-${Math.floor(
        Math.random() * 900 + 100
      )}).`,
      timeAgo: 'Just now',
      read: false,
      type: 'general',
      issueId: newIssue.id,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    setActiveTab('home');
    showToast('Report submitted successfully (<45s)!');
  };

  // Status update (Admin or confirmation)
  const handleUpdateStatus = (
    issueId: string,
    newStatus: IssueStatus,
    etaNotice?: string,
    technician?: string
  ) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: newStatus,
            etaNotice: etaNotice !== undefined ? etaNotice : issue.etaNotice,
            assignedTechnician: technician || issue.assignedTechnician,
            comments: [
              ...issue.comments,
              {
                id: `c-status-${Date.now()}`,
                author: 'Facilities Ops',
                isOfficial: true,
                timeAgo: 'Just now',
                text: `Status shifted to ${newStatus.replace('_', ' ').toUpperCase()}.${
                  etaNotice ? ` (${etaNotice})` : ''
                }`,
              },
            ],
          };
        }
        return issue;
      })
    );

    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              etaNotice: etaNotice !== undefined ? etaNotice : prev.etaNotice,
              assignedTechnician: technician || prev.assignedTechnician,
            }
          : null
      );
    }

    showToast(`Status updated to ${newStatus.replace('_', ' ')}`);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const myReportsCount = issues.filter(
    (i) => i.reportedBy.includes('Student') || i.isAnonymous
  ).length;
  const totalUpvotesCount = issues.reduce((acc, curr) => acc + (curr.hasUpvoted ? 1 : 0), 0) + 12;

  return (
    <div className="bg-[#09090b] text-zinc-100 min-h-screen flex flex-col antialiased pb-28 selection:bg-blue-600 selection:text-white">
      {/* Fixed Header */}
      <Header
        activeTab={activeTab}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto pt-20 px-4">
        {activeTab === 'home' && (
          <CampusFeedView
            issues={issues}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedStatus={selectedStatus}
            onSelectStatus={setSelectedStatus}
            onOpenFilter={() => setIsFilterOpen(true)}
            onOpenReport={() => setActiveTab('report')}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onUpvote={handleUpvote}
            onShare={handleShare}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        )}

        {activeTab === 'explore' && (
          <ExploreView
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onUpvote={handleUpvote}
            onShare={handleShare}
            onOpenReport={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'report' && (
          <ReportIssueView
            onSubmitIssue={handleCreateIssue}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'my-reports' && (
          <MyReportsView
            issues={issues}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onOpenReport={() => setActiveTab('report')}
            onConfirmResolution={(id) =>
              handleUpdateStatus(id, 'resolved', 'Verified by student reporter')
            }
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            issues={issues}
            onUpdateStatus={handleUpdateStatus}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        myReportsCount={myReportsCount}
      />

      {/* Floating Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-800/95 border border-zinc-700 text-zinc-100 text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMessage}
        </div>
      )}

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        onClose={() => setSelectedIssue(null)}
        onUpvote={handleUpvote}
        onAddComment={handleAddComment}
        onStatusChange={(id, st) => handleUpdateStatus(id, st)}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        sortBy={sortBy}
        onSelectSortBy={setSortBy}
        onReset={() => {
          setSelectedCategory('all');
          setSelectedStatus('all');
          setSelectedZone('All Zones');
          setSortBy('urgency');
        }}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectNotification={(issueId) => {
          if (issueId) {
            const found = issues.find((i) => i.id === issueId);
            if (found) setSelectedIssue(found);
          }
        }}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        myReportsCount={myReportsCount}
        totalUpvotesCount={totalUpvotesCount}
      />

      {/* Share Modal */}
      <ShareModal
        issue={shareIssue}
        isOpen={!!shareIssue}
        onClose={() => setShareIssue(null)}
      />
    </div>
  );
}
