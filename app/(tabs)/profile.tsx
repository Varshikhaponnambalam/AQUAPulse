import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  withRepeat,
} from 'react-native-reanimated';
import {
  User,
  Settings,
  Download,
  Share,
  Moon,
  Sun,
  Bell,
  Shield,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const USER_ROLES = ['Farmer', 'Researcher', 'Policymaker'];

export default function Profile() {
  const [selectedRole, setSelectedRole] = useState('Farmer');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const avatarAnimation = useSharedValue(0);
  const modeTransition = useSharedValue(0);

  useEffect(() => {
    avatarAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    modeTransition.value = withTiming(darkMode ? 1 : 0, { duration: 500 });
  }, [darkMode]);

  const avatarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(avatarAnimation.value, [0, 1], [1, 1.05]),
        },
      ],
    };
  });

  const modeTransitionStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(modeTransition.value, [0, 1], [1, 0.8]),
    };
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'Farmer':
        return '#00FF88';
      case 'Researcher':
        return '#00D4FF';
      case 'Policymaker':
        return '#FFB800';
      default:
        return '#4A90A4';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Farmer':
        return '🌾';
      case 'Researcher':
        return '🔬';
      case 'Policymaker':
        return '🏛️';
      default:
        return '👤';
    }
  };

  const handleExport = (format) => {
    // Simulate export functionality
    console.log(`Exporting data as ${format}`);
  };

  return (
    <Animated.View style={[styles.container, modeTransitionStyle]}>
      <LinearGradient
        colors={
          darkMode
            ? ['#000511', '#001122', '#002244']
            : ['#001A2E', '#003A5C', '#0077BE']
        }
        style={styles.backgroundGradient}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Animated.View style={[styles.avatarContainer, avatarStyle]}>
            <BlurView intensity={20} style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </BlurView>
          </Animated.View>

          <Text style={styles.userName}>sai abhyankar</Text>
          <Text style={styles.userEmail}>sai.abhyankar@pulse.com</Text>

          <View style={styles.roleSelector}>
            {USER_ROLES.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleButton,
                  selectedRole === role && {
                    backgroundColor: getRoleColor(role) + '30',
                    borderColor: getRoleColor(role),
                  },
                ]}
                onPress={() => setSelectedRole(role)}
              >
                <Text style={styles.roleIcon}>{getRoleIcon(role)}</Text>
                <Text
                  style={[
                    styles.roleText,
                    selectedRole === role && { color: getRoleColor(role) },
                  ]}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Role-based Dashboard Stats */}
        <View style={styles.dashboardStats}>
          <Text style={styles.sectionTitle}>Dashboard Overview</Text>
          <View style={styles.statsContainer}>
            {selectedRole === 'Farmer' && (
              <>
                <StatCard title="Fields Monitored" value="12" icon="🌾" />
                <StatCard title="Water Saved" value="2,340L" icon="💧" />
                <StatCard title="Efficiency" value="87%" icon="⚡" />
              </>
            )}
            {selectedRole === 'Researcher' && (
              <>
                <StatCard title="Data Points" value="45,231" icon="📊" />
                <StatCard title="Studies" value="23" icon="📚" />
                <StatCard title="Accuracy" value="94%" icon="🎯" />
              </>
            )}
            {selectedRole === 'Policymaker' && (
              <>
                <StatCard title="Regions" value="15" icon="🗺️" />
                <StatCard title="Policies" value="8" icon="📋" />
                <StatCard title="Impact Score" value="8.4" icon="📈" />
              </>
            )}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <SettingItem
            icon={
              darkMode ? (
                <Moon size={20} color="#4A90A4" />
              ) : (
                <Sun size={20} color="#4A90A4" />
              )
            }
            title="Dark Mode"
            subtitle="Toggle dark theme"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#4A90A4', true: '#00D4FF' }}
                thumbColor={darkMode ? '#ffffff' : '#f4f3f4'}
              />
            }
          />

          <SettingItem
            icon={<Bell size={20} color="#4A90A4" />}
            title="Notifications"
            subtitle="Push notifications for alerts"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#4A90A4', true: '#00D4FF' }}
                thumbColor={notifications ? '#ffffff' : '#f4f3f4'}
              />
            }
          />

          <SettingItem
            icon={<Shield size={20} color="#4A90A4" />}
            title="Privacy"
            subtitle="Data privacy settings"
            onPress={() => console.log('Privacy settings')}
          />

          <SettingItem
            icon={<Settings size={20} color="#4A90A4" />}
            title="Advanced"
            subtitle="Advanced configuration"
            onPress={() => console.log('Advanced settings')}
          />
        </View>

        {/* Data Export Section */}
        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Data Export</Text>

          <View style={styles.exportButtons}>
            <ExportButton
              title="Export PDF"
              subtitle="Detailed reports"
              icon="📄"
              onPress={() => handleExport('PDF')}
            />
            <ExportButton
              title="Export Excel"
              subtitle="Raw data sheets"
              icon="📊"
              onPress={() => handleExport('Excel')}
            />
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <BlurView intensity={15} style={styles.shareButtonContent}>
              <Share size={20} color="#00D4FF" />
              <Text style={styles.shareButtonText}>Share Dashboard</Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.accountSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.accountButton}>
            <Text style={styles.accountButtonText}>Sync Data</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountButton}>
            <Text style={styles.accountButtonText}>Cache Management</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.accountButton, styles.signOutButton]}
          >
            <Text style={[styles.accountButtonText, styles.signOutText]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 2.1.0</Text>
          <Text style={styles.appCopyright}>AQUA PULSE</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <BlurView intensity={15} style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </BlurView>
  );
}

function SettingItem({ icon, title, subtitle, rightComponent, onPress }) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>{icon}</View>
        <View>
          <Text style={styles.settingTitle}>{title}</Text>
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        </View>
      </View>
      {rightComponent}
    </TouchableOpacity>
  );
}

function ExportButton({ title, subtitle, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.exportButton} onPress={onPress}>
      <BlurView intensity={15} style={styles.exportButtonContent}>
        <Text style={styles.exportIcon}>{icon}</Text>
        <Text style={styles.exportTitle}>{title}</Text>
        <Text style={styles.exportSubtitle}>{subtitle}</Text>
      </BlurView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001A2E',
  },
  backgroundGradient: {
    position: 'absolute',
    width: width,
    height: height,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#00D4FF',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#00D4FF',
  },
  userName: {
    fontSize: Platform.OS === 'web' ? 28 : 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#4A90A4',
    marginBottom: 20,
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  roleButton: {
    flex: 1,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  roleText: {
    fontSize: 12,
    color: '#4A90A4',
    fontWeight: '600',
  },
  dashboardStats: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: Platform.OS === 'web' ? '30%' : width * 0.28,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 10,
    color: '#4A90A4',
    textAlign: 'center',
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 3,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#4A90A4',
  },
  exportSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  exportButton: {
    width: Platform.OS === 'web' ? '48%' : width * 0.42,
  },
  exportButtonContent: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  exportIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  exportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  exportSubtitle: {
    fontSize: 10,
    color: '#4A90A4',
    textAlign: 'center',
  },
  shareButton: {
    width: '100%',
  },
  shareButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D4FF',
    marginLeft: 10,
  },
  accountSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  accountButton: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 10,
    alignItems: 'center',
  },
  accountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  signOutButton: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: '#FF4444',
  },
  signOutText: {
    color: '#FF4444',
  },
  appInfo: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 14,
    color: '#4A90A4',
    marginBottom: 5,
  },
  appCopyright: {
    fontSize: 12,
    color: '#4A90A4',
  },
});
