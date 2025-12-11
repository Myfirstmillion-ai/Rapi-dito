import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit,
  Star,
  Navigation,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { useCaptain } from '../../contexts/CaptainContext';
import { GlassCard, Avatar, IconButton, Badge } from '../../components/atoms';
import { AppShell } from '../../components/layout';
import { FADE_VARIANTS, STAGGER_CONTAINER, STAGGER_ITEM, triggerHaptic } from '../../design-system';

/**
 * ProfileScreen - User/Captain Profile Settings
 * 
 * Displays profile information and settings menu.
 * 
 * @param {string} userType - 'user' or 'captain'
 */
function ProfileScreen({ userType = 'user' }) {
  const navigate = useNavigate();
  const { user, logout: userLogout } = useUser();
  const { captain, logout: captainLogout } = useCaptain();
  
  const currentUser = userType === 'captain' ? captain : user;
  const logout = userType === 'captain' ? captainLogout : userLogout;

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Profile stats (mock data)
  const stats = userType === 'captain' ? {
    rating: 4.8,
    totalRides: 1250,
    totalEarnings: 3500000,
  } : {
    rating: 4.9,
    totalRides: 87,
  };

  // Menu sections
  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          onClick: () => navigate(`/${userType}/edit-profile`),
        },
        {
          icon: Mail,
          label: 'Email',
          value: currentUser?.email || 'Not set',
          onClick: () => navigate(`/${userType}/email-settings`),
        },
        {
          icon: Phone,
          label: 'Phone',
          value: currentUser?.phone || 'Not set',
          onClick: () => navigate(`/${userType}/phone-settings`),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Notifications',
          onClick: () => navigate('/notifications-settings'),
        },
        ...(userType === 'user' ? [
          {
            icon: CreditCard,
            label: 'Payment Methods',
            onClick: () => navigate('/payment-methods'),
          },
          {
            icon: MapPin,
            label: 'Saved Places',
            onClick: () => navigate('/saved-places'),
          },
        ] : []),
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          onClick: () => navigate('/help'),
        },
        {
          icon: Shield,
          label: 'Safety',
          onClick: () => navigate('/safety'),
        },
      ],
    },
  ];

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      setIsLoggingOut(true);
      triggerHaptic('medium');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      logout();
      navigate('/');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <AppShell>
      <div className="min-h-screen-dvh bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <motion.div
          variants={FADE_VARIANTS}
          initial="hidden"
          animate="visible"
          className="bg-gradient-to-br from-emerald-500 to-emerald-600 pt-safe pb-8"
        >
          <div className="flex items-center justify-between px-4 py-4 mb-6">
            <IconButton
              icon={ArrowLeft}
              onClick={() => navigate(-1)}
              variant="default"
            />
            <h1 className="text-xl font-bold text-white">Profile</h1>
            <IconButton
              icon={Edit}
              onClick={() => navigate(`/${userType}/edit-profile`)}
              variant="default"
            />
          </div>

          {/* Profile Card */}
          <div className="px-4">
            <GlassCard variant="light" className="text-center">
              <Avatar
                src={currentUser?.avatar}
                alt={currentUser?.fullName || 'User'}
                fallback={currentUser?.fullName?.charAt(0) || 'U'}
                size="xl"
                className="mx-auto mb-4"
              />
              
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {currentUser?.fullName || 'User'}
              </h2>
              
              {currentUser?.email && (
                <p className="text-sm text-gray-600 mb-4">{currentUser.email}</p>
              )}

              {/* Stats */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-gray-900">{stats.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                
                <div className="w-px h-8 bg-gray-200" />
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Navigation className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-gray-900">{stats.totalRides}</span>
                  </div>
                  <p className="text-xs text-gray-500">Rides</p>
                </div>
                
                {userType === 'captain' && (
                  <>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <p className="font-bold text-gray-900 mb-1">
                        {formatCurrency(stats.totalEarnings)}
                      </p>
                      <p className="text-xs text-gray-500">Earned</p>
                    </div>
                  </>
                )}
              </div>
            </GlassCard>
          </div>
        </motion.div>

        {/* Menu Sections */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          animate="visible"
          className="px-4 py-6 space-y-6"
        >
          {menuSections.map((section, sectionIndex) => (
            <motion.div
              key={sectionIndex}
              variants={STAGGER_ITEM}
              className="space-y-2"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider px-2">
                {section.title}
              </h3>
              
              <GlassCard variant="light" className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{item.label}</p>
                        {item.value && (
                          <p className="text-sm text-gray-500">{item.value}</p>
                        )}
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  );
                })}
              </GlassCard>
            </motion.div>
          ))}

          {/* Logout Button */}
          <motion.div variants={STAGGER_ITEM}>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 hover:bg-red-100 rounded-2xl border border-red-100 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-600">
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </span>
            </button>
          </motion.div>

          {/* App Version */}
          <p className="text-center text-sm text-gray-400">
            Rapi-dito v1.0.0
          </p>
        </motion.div>
      </div>
    </AppShell>
  );
}

export default ProfileScreen;
