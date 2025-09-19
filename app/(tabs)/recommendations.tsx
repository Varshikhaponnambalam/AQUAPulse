import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  interpolate,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { Droplets, Chrome as Home, Sprout, Building, Award, Star } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const WATER_TIPS = [
  {
    id: 1,
    category: 'agriculture',
    icon: '🌾',
    title: 'Switch to Drip Irrigation',
    description: 'Save up to 40% more water with precision watering',
    impact: 'High Impact',
    savings: '40% water savings',
    animation: 'flow'
  },
  {
    id: 2,
    category: 'home',
    icon: '🏡',
    title: 'Fix Leaky Taps',
    description: 'Turn off taps while brushing - save 10 liters daily',
    impact: 'Medium Impact',
    savings: '10L daily',
    animation: 'drip'
  },
  {
    id: 3,
    category: 'urban',
    icon: '🏙️',
    title: 'Rainwater Harvesting',
    description: 'Install rainwater harvesting systems on rooftops',
    impact: 'Very High Impact',
    savings: '60% recharge boost',
    animation: 'rain'
  },
  {
    id: 4,
    category: 'environment',
    icon: '⚠️',
    title: 'Avoid Chemical Contamination',
    description: 'Avoid dumping chemicals - it contaminates groundwater',
    impact: 'Critical',
    savings: 'Prevent pollution',
    animation: 'warning'
  },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Water Saver', progress: 100, icon: '💧', color: '#00D4FF' },
  { id: 2, title: 'Water Warrior', progress: 65, icon: '⚔️', color: '#00FF88' },
  { id: 3, title: 'Water Hero', progress: 30, icon: '🏆', color: '#FFB800' },
];

export default function Recommendations() {
  const [selectedTip, setSelectedTip] = useState(0);
  const [userPoints, setUserPoints] = useState(1250);
  const rotationAnimation = useSharedValue(0);
  const cardAnimation = useSharedValue(0);
  const particleAnimation = useSharedValue(0);

  useEffect(() => {
    rotationAnimation.value = withRepeat(
      withTiming(1, { duration: 8000 }),
      -1,
      false
    );
    
    cardAnimation.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );

    particleAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 100 })
      ),
      -1,
      false
    );
  }, []);

  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        rotateY: `${interpolate(rotationAnimation.value, [0, 1], [0, 360])}deg`
      }],
    };
  });

  const cardFloatStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateY: interpolate(cardAnimation.value, [0, 1], [0, -10])
      }],
    };
  });

  const particleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(particleAnimation.value, [0, 0.5, 1], [1, 0.5, 0]),
      transform: [{
        translateY: interpolate(particleAnimation.value, [0, 1], [0, -30])
      }, {
        scale: interpolate(particleAnimation.value, [0, 1], [1, 0.5])
      }],
    };
  });

  const handleTipPress = (index) => {
    setSelectedTip(index);
    setUserPoints(prev => prev + 10);
  };

  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'very high impact': return '#00FF88';
      case 'high impact': return '#00D4FF';
      case 'medium impact': return '#FFB800';
      case 'critical': return '#FF4444';
      default: return '#4A90A4';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#001A2E', '#003A5C', '#0077BE']}
        style={styles.backgroundGradient}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Water Conservation</Text>
          <Text style={styles.subtitle}>Smart tips for sustainable living</Text>
          
          {/* User Points */}
          <BlurView intensity={15} style={styles.pointsContainer}>
            <Star size={24} color="#FFB800" />
            <Text style={styles.pointsText}>{userPoints} Points</Text>
            <Animated.View style={particleStyle}>
              <Text style={styles.pointsParticle}>+10</Text>
            </Animated.View>
          </BlurView>
        </View>

        {/* 3D Rotating Tip Cards */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Conservation Tips</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tipsScroll}
            pagingEnabled
          >
            {WATER_TIPS.map((tip, index) => (
              <Animated.View
                key={tip.id}
                style={[
                  styles.tipCardContainer,
                  selectedTip === index ? rotationStyle : cardFloatStyle
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleTipPress(index)}
                  activeOpacity={0.8}
                >
                  <BlurView intensity={20} style={styles.tipCard}>
                    <View style={styles.tipHeader}>
                      <Text style={styles.tipIcon}>{tip.icon}</Text>
                      <View style={[
                        styles.impactBadge,
                        { backgroundColor: getImpactColor(tip.impact) + '20' }
                      ]}>
                        <Text style={[
                          styles.impactText,
                          { color: getImpactColor(tip.impact) }
                        ]}>
                          {tip.impact}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.tipTitle}>{tip.title}</Text>
                    <Text style={styles.tipDescription}>{tip.description}</Text>
                    
                    <View style={styles.tipFooter}>
                      <Text style={styles.tipSavings}>{tip.savings}</Text>
                      <AnimatedIcon animation={tip.animation} />
                    </View>
                  </BlurView>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        {/* Conservation Infographics */}
        <View style={styles.infographicsSection}>
          <Text style={styles.sectionTitle}>Conservation Methods</Text>
          
          <InfographicCard
            title="Rooftop Rainwater Harvesting"
            steps={['Rooftop Collection', 'Filtration System', 'Storage Tank', 'Distribution']}
            icon="🏠"
            efficiency="85% efficiency"
          />
          
          <InfographicCard
            title="Drip Irrigation System"
            steps={['Water Source', 'Pressure Control', 'Drip Emitters', 'Plant Roots']}
            icon="🌱"
            efficiency="90% efficiency"
          />
          
          <InfographicCard
            title="Groundwater Recharge"
            steps={['Rainwater', 'Percolation Pit', 'Soil Layers', 'Aquifer']}
            icon="💧"
            efficiency="70% recharge"
          />
        </View>

        {/* Gamification Section */}
        <View style={styles.gamificationSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          
          <View style={styles.achievementsContainer}>
            {ACHIEVEMENTS.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                title={achievement.title}
                progress={achievement.progress}
                icon={achievement.icon}
                color={achievement.color}
              />
            ))}
          </View>
          
          {/* Challenge of the Week */}
          <BlurView intensity={15} style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>Weekly Challenge</Text>
              <Text style={styles.challengeReward}>+100 pts</Text>
            </View>
            <Text style={styles.challengeDescription}>
              Reduce your daily water consumption by 15% this week
            </Text>
            <View style={styles.challengeProgress}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
              <Text style={styles.progressText}>60% Complete</Text>
            </View>
          </BlurView>
        </View>

        {/* Voice Assistant */}
        <View style={styles.assistantSection}>
          <TouchableOpacity style={styles.voiceButton}>
            <BlurView intensity={20} style={styles.voiceButtonContent}>
              <Text style={styles.voiceIcon}>🎤</Text>
              <Text style={styles.voiceText}>Ask Water Assistant</Text>
              <Text style={styles.voiceSubtext}>Voice commands for rural users</Text>
            </BlurView>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function AnimatedIcon({ animation }) {
  const iconAnimation = useSharedValue(0);

  useEffect(() => {
    iconAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    switch (animation) {
      case 'flow':
        return {
          transform: [{
            translateX: interpolate(iconAnimation.value, [0, 1], [0, 10])
          }],
        };
      case 'drip':
        return {
          transform: [{
            translateY: interpolate(iconAnimation.value, [0, 1], [0, 5])
          }],
        };
      case 'rain':
        return {
          transform: [{
            scale: interpolate(iconAnimation.value, [0, 1], [1, 1.1])
          }],
        };
      case 'warning':
        return {
          transform: [{
            rotate: `${interpolate(iconAnimation.value, [0, 1], [-5, 5])}deg`
          }],
        };
      default:
        return {};
    }
  });

  const getIcon = () => {
    switch (animation) {
      case 'flow': return '💧';
      case 'drip': return '🚰';
      case 'rain': return '🌧️';
      case 'warning': return '⚠️';
      default: return '💧';
    }
  };

  return (
    <Animated.Text style={[styles.animatedIcon, animatedStyle]}>
      {getIcon()}
    </Animated.Text>
  );
}

function InfographicCard({ title, steps, icon, efficiency }) {
  return (
    <BlurView intensity={15} style={styles.infographicCard}>
      <View style={styles.infographicHeader}>
        <Text style={styles.infographicIcon}>{icon}</Text>
        <Text style={styles.infographicTitle}>{title}</Text>
      </View>
      
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
            {index < steps.length - 1 && <Text style={styles.stepArrow}>→</Text>}
          </View>
        ))}
      </View>
      
      <Text style={styles.efficiencyText}>{efficiency}</Text>
    </BlurView>
  );
}

function AchievementCard({ title, progress, icon, color }) {
  const progressAnimation = useSharedValue(0);

  useEffect(() => {
    progressAnimation.value = withTiming(progress / 100, { duration: 2000 });
  }, [progress]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progressAnimation.value, [0, 1], [0, 100])}%`,
    };
  });

  return (
    <BlurView intensity={10} style={styles.achievementCard}>
      <Text style={styles.achievementIcon}>{icon}</Text>
      <Text style={styles.achievementTitle}>{title}</Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <Animated.View style={[
            styles.progressBar,
            progressStyle,
            { backgroundColor: color }
          ]} />
        </View>
        <Text style={styles.progressPercentage}>{progress}%</Text>
      </View>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A90A4',
    marginBottom: 20,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    position: 'relative',
  },
  pointsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  pointsParticle: {
    position: 'absolute',
    right: -20,
    top: -20,
    color: '#FFB800',
    fontSize: 14,
    fontWeight: '700',
  },
  tipsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  tipsScroll: {
    paddingLeft: 20,
  },
  tipCardContainer: {
    width: Platform.OS === 'web' ? 300 : width * 0.8,
    marginRight: 15,
  },
  tipCard: {
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    height: 250,
    justifyContent: 'space-between',
  },
  tipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipIcon: {
    fontSize: 32,
  },
  impactBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  impactText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
  },
  tipDescription: {
    fontSize: 14,
    color: '#4A90A4',
    lineHeight: 20,
    marginBottom: 15,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipSavings: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00FF88',
  },
  animatedIcon: {
    fontSize: 20,
  },
  infographicsSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  infographicCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 15,
  },
  infographicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infographicIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infographicTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#00D4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 10,
    color: '#4A90A4',
    textAlign: 'center',
  },
  stepArrow: {
    color: '#00D4FF',
    fontSize: 16,
    marginTop: 5,
  },
  efficiencyText: {
    color: '#00FF88',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  gamificationSection: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  achievementCard: {
    width: Platform.OS === 'web' ? '30%' : width * 0.28,
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 5,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  progressPercentage: {
    fontSize: 10,
    color: '#4A90A4',
  },
  challengeCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  challengeReward: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFB800',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#4A90A4',
    marginBottom: 15,
    lineHeight: 20,
  },
  challengeProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D4FF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#00D4FF',
    marginLeft: 10,
    fontWeight: '600',
  },
  assistantSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  voiceButton: {
    width: '100%',
  },
  voiceButtonContent: {
    padding: 25,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  voiceText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  voiceSubtext: {
    fontSize: 12,
    color: '#4A90A4',
    textAlign: 'center',
  },
});