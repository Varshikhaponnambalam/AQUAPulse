import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  useAnimatedScrollHandler,
  runOnJS,
} from 'react-native-reanimated';
import {
  Droplets,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Dashboard() {
  const [waterLevel, setWaterLevel] = useState(72);
  const scrollY = useSharedValue(0);
  const waveAnimation = useSharedValue(0);
  const tankFillAnimation = useSharedValue(0);

  useEffect(() => {
    waveAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
    tankFillAnimation.value = withTiming(waterLevel / 100, { duration: 2000 });
  }, [waterLevel]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const parallaxStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(scrollY.value, [0, 200], [0, -50]),
        },
      ],
    };
  });

  const waveStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(waveAnimation.value, [0, 1], [-20, 20]),
        },
      ],
    };
  });

  const tankFillStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(tankFillAnimation.value, [0, 1], [0, 200]),
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#001A2E', '#003A5C', '#0077BE']}
        style={styles.backgroundGradient}
      />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, parallaxStyle]}>
          <Text style={styles.heroTitle}>
            <i>
              <b>AQUA PULSE</b>
            </i>
          </Text>
          <Text style={styles.heroSubtitle}>Real-time aquifer tracking</Text>

          {/* 3D Water Tank */}
          <View style={styles.tankContainer}>
            <BlurView intensity={20} style={styles.tankBackground}>
              <View style={styles.tank}>
                <Animated.View style={[styles.waterFill, tankFillStyle]} />
                <Animated.View style={[styles.waves, waveStyle]}>
                  <View style={styles.wave1} />
                  <View style={styles.wave2} />
                </Animated.View>
              </View>
            </BlurView>
            <Text style={styles.waterLevelText}>{waterLevel}%</Text>
            <Text style={styles.depthText}>Level -4.5m (Normal)</Text>
          </View>
        </Animated.View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard
            icon={<Droplets size={24} color="#00D4FF" />}
            title="Available Water"
            value="2.8M Liters"
            change="+5.2%"
            trend="up"
          />
          <StatsCard
            icon={<Activity size={24} color="#00D4FF" />}
            title="Recharge Rate"
            value="145L/min"
            change="-2.1%"
            trend="down"
          />
          <StatsCard
            icon={<TrendingUp size={24} color="#00D4FF" />}
            title="Quality Index"
            value="8.4/10"
            change="+0.3"
            trend="up"
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <ActivityItem
            time="2 hours ago"
            message="Water level increased by 0.3m after rainfall"
            type="positive"
          />
          <ActivityItem
            time="6 hours ago"
            message="Quality test completed - All parameters normal"
            type="neutral"
          />
          <ActivityItem
            time="1 day ago"
            message="Recharge rate below average - Conservation needed"
            type="warning"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtonsContainer}>
            <ActionButton title="View Forecast" icon="📈" />
            <ActionButton title="Export Data" icon="📊" />
            <ActionButton title="Set Alert" icon="🔔" />
            <ActionButton title="Share Report" icon="📤" />
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

function StatsCard({ icon, title, value, change, trend }) {
  return (
    <BlurView intensity={15} style={styles.statsCard}>
      <View style={styles.statsCardHeader}>
        {icon}
        <View
          style={[
            styles.trendIndicator,
            { backgroundColor: trend === 'up' ? '#00FF88' : '#FF4444' },
          ]}
        >
          {trend === 'up' ? (
            <TrendingUp size={12} color="white" />
          ) : (
            <TrendingDown size={12} color="white" />
          )}
        </View>
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text
        style={[
          styles.statsChange,
          { color: trend === 'up' ? '#00FF88' : '#FF4444' },
        ]}
      >
        {change}
      </Text>
    </BlurView>
  );
}

function ActivityItem({ time, message, type }) {
  const getTypeColor = () => {
    switch (type) {
      case 'positive':
        return '#00FF88';
      case 'warning':
        return '#FFB800';
      default:
        return '#00D4FF';
    }
  };

  return (
    <BlurView intensity={10} style={styles.activityItem}>
      <View style={[styles.activityDot, { backgroundColor: getTypeColor() }]} />
      <View style={styles.activityContent}>
        <Text style={styles.activityMessage}>{message}</Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </BlurView>
  );
}

function ActionButton({ title, icon }) {
  return (
    <BlurView intensity={15} style={styles.actionButton}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
    </BlurView>
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
  heroSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 400,
  },
  heroTitle: {
    fontSize: Platform.OS === 'web' ? 42 : 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#4A90A4',
    textAlign: 'center',
    marginBottom: 40,
  },
  tankContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  tankBackground: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tank: {
    width: 200,
    height: 250,
    borderWidth: 3,
    borderColor: '#00D4FF',
    borderRadius: 15,
    backgroundColor: 'rgba(0, 119, 190, 0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  waterFill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0, 212, 255, 0.6)',
    borderRadius: 12,
  },
  waves: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
  },
  wave1: {
    position: 'absolute',
    bottom: 20,
    width: '120%',
    height: 20,
    backgroundColor: 'rgba(0, 212, 255, 0.4)',
    borderRadius: 50,
    left: -20,
  },
  wave2: {
    position: 'absolute',
    bottom: 10,
    width: '110%',
    height: 15,
    backgroundColor: 'rgba(0, 212, 255, 0.3)',
    borderRadius: 50,
    left: -10,
  },
  waterLevelText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#00D4FF',
    marginTop: 20,
  },
  depthText: {
    fontSize: 16,
    color: '#4A90A4',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statsCard: {
    width: Platform.OS === 'web' ? '30%' : width * 0.28,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 15,
  },
  statsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trendIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  statsTitle: {
    fontSize: 12,
    color: '#4A90A4',
    marginBottom: 5,
  },
  statsChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
  },
  activityItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 10,
    alignItems: 'center',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: 'white',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#4A90A4',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: Platform.OS === 'web' ? '22%' : width * 0.42,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
