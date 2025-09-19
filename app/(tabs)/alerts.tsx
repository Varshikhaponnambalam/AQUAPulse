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
  withSequence
} from 'react-native-reanimated';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info, Bell, Settings } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const ALERTS = [
  {
    id: 1,
    type: 'critical',
    title: 'Critical Water Level',
    message: 'Station Gamma has reached critically low levels (1.3m)',
    time: '2 minutes ago',
    location: 'Delhi NCR - Sector 45',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Recharge Rate Declining',
    message: 'Water recharge rate has dropped below normal threshold',
    time: '15 minutes ago',
    location: 'Gurgaon - Phase 2',
  },
  {
    id: 3,
    type: 'info',
    title: 'Maintenance Scheduled',
    message: 'Station Beta will undergo routine maintenance tomorrow',
    time: '1 hour ago',
    location: 'Noida - Sector 62',
  },
  {
    id: 4,
    type: 'success',
    title: 'Level Recovered',
    message: 'Station Alpha water level has improved significantly',
    time: '3 hours ago',
    location: 'Delhi - Central',
  },
];

export default function Alerts() {
  const [selectedAlert, setSelectedAlert] = useState(null);
  const dropletAnimation = useSharedValue(0);
  const cardFlipAnimation = useSharedValue(0);

  useEffect(() => {
    dropletAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0, { duration: 200 })
      ),
      -1,
      false
    );
  }, []);

  const handleCardPress = (alert) => {
    cardFlipAnimation.value = withSequence(
      withTiming(0.5, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );
    setSelectedAlert(alert);
  };

  const dropletStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateY: interpolate(dropletAnimation.value, [0, 1], [0, 20])
      }],
      opacity: interpolate(dropletAnimation.value, [0, 0.5, 1], [1, 0.7, 0]),
    };
  });

  const cardFlipStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        rotateY: `${interpolate(cardFlipAnimation.value, [0, 0.5, 1], [0, 90, 0])}deg`
      }],
    };
  });

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={24} color="#FF4444" />;
      case 'warning':
        return <AlertTriangle size={24} color="#FFB800" />;
      case 'success':
        return <CheckCircle size={24} color="#00FF88" />;
      default:
        return <Info size={24} color="#00D4FF" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return '#FF4444';
      case 'warning': return '#FFB800';
      case 'success': return '#00FF88';
      default: return '#00D4FF';
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#001A2E', '#003A5C', '#0077BE']}
        style={styles.backgroundGradient}
      />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Alerts & Notifications</Text>
          <Text style={styles.subtitle}>Real-time system updates</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Alert Summary */}
      <View style={styles.summaryContainer}>
        <SummaryCard
          title="Critical"
          count={1}
          color="#FF4444"
          icon="⚠️"
        />
        <SummaryCard
          title="Warnings"
          count={1}
          color="#FFB800"
          icon="⚡"
        />
        <SummaryCard
          title="Info"
          count={2}
          color="#00D4FF"
          icon="ℹ️"
        />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Active Alerts */}
        <Text style={styles.sectionTitle}>Active Alerts</Text>
        
        {ALERTS.map((alert) => (
          <Animated.View key={alert.id} style={cardFlipStyle}>
            <TouchableOpacity
              onPress={() => handleCardPress(alert)}
              activeOpacity={0.8}
            >
              <BlurView intensity={15} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertIconContainer}>
                    {getAlertIcon(alert.type)}
                    {alert.type === 'critical' && (
                      <Animated.View style={[styles.droplet, dropletStyle]}>
                        <Text style={styles.dropletIcon}>💧</Text>
                      </Animated.View>
                    )}
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertMessage}>{alert.message}</Text>
                    <View style={styles.alertMeta}>
                      <Text style={styles.alertTime}>{alert.time}</Text>
                      <Text style={styles.alertLocation}>{alert.location}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.alertStatus,
                    { backgroundColor: getAlertColor(alert.type) }
                  ]} />
                </View>
              </BlurView>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Alert History */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent History</Text>
          
          <HistoryItem
            type="resolved"
            title="Low pressure issue resolved"
            time="6 hours ago"
            location="Faridabad - Sector 21"
          />
          <HistoryItem
            type="resolved"
            title="System maintenance completed"
            time="1 day ago"
            location="Ghaziabad - Indirapuram"
          />
          <HistoryItem
            type="dismissed"
            title="Minor quality fluctuation"
            time="2 days ago"
            location="Delhi - Dwarka"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <ActionButton
              title="Create Alert"
              icon="+"
              color="#00D4FF"
            />
            <ActionButton
              title="View Reports"
              icon="📊"
              color="#00FF88"
            />
            <ActionButton
              title="Emergency"
              icon="🚨"
              color="#FF4444"
            />
          </View>
        </View>
      </ScrollView>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <View style={styles.modalOverlay}>
          <BlurView intensity={30} style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedAlert.title}</Text>
              <TouchableOpacity
                onPress={() => setSelectedAlert(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.modalMessage}>{selectedAlert.message}</Text>
              <Text style={styles.modalLocation}>📍 {selectedAlert.location}</Text>
              <Text style={styles.modalTime}>🕒 {selectedAlert.time}</Text>
              
              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.modalButton, styles.acknowledgeButton]}>
                  <Text style={styles.modalButtonText}>Acknowledge</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.escalateButton]}>
                  <Text style={styles.modalButtonText}>Escalate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </View>
      )}
    </View>
  );
}

function SummaryCard({ title, count, color, icon }) {
  const pulseAnimation = useSharedValue(0);

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: interpolate(pulseAnimation.value, [0, 1], [1, 1.05])
      }],
    };
  });

  return (
    <Animated.View style={pulseStyle}>
      <BlurView intensity={15} style={styles.summaryCard}>
        <Text style={styles.summaryIcon}>{icon}</Text>
        <Text style={[styles.summaryCount, { color }]}>{count}</Text>
        <Text style={styles.summaryTitle}>{title}</Text>
      </BlurView>
    </Animated.View>
  );
}

function HistoryItem({ type, title, time, location }) {
  const getTypeColor = () => {
    switch (type) {
      case 'resolved': return '#00FF88';
      case 'dismissed': return '#4A90A4';
      default: return '#00D4FF';
    }
  };

  return (
    <View style={styles.historyItem}>
      <View style={[styles.historyDot, { backgroundColor: getTypeColor() }]} />
      <View style={styles.historyContent}>
        <Text style={styles.historyTitle}>{title}</Text>
        <Text style={styles.historyMeta}>{time} • {location}</Text>
      </View>
    </View>
  );
}

function ActionButton({ title, icon, color }) {
  return (
    <TouchableOpacity style={styles.actionButton}>
      <BlurView intensity={15} style={styles.actionButtonContent}>
        <Text style={[styles.actionIcon, { color }]}>{icon}</Text>
        <Text style={styles.actionTitle}>{title}</Text>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  },
  settingsButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  summaryCard: {
    width: Platform.OS === 'web' ? '30%' : width * 0.28,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  summaryCount: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 5,
  },
  summaryTitle: {
    fontSize: 12,
    color: '#4A90A4',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 15,
  },
  alertCard: {
    marginBottom: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  alertHeader: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-start',
  },
  alertIconContainer: {
    marginRight: 15,
    position: 'relative',
  },
  droplet: {
    position: 'absolute',
    top: -10,
    left: 5,
  },
  dropletIcon: {
    fontSize: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 14,
    color: '#4A90A4',
    marginBottom: 10,
    lineHeight: 20,
  },
  alertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alertTime: {
    fontSize: 12,
    color: '#4A90A4',
  },
  alertLocation: {
    fontSize: 12,
    color: '#4A90A4',
  },
  alertStatus: {
    width: 4,
    height: '100%',
    borderRadius: 2,
    marginLeft: 10,
  },
  historySection: {
    marginTop: 30,
    marginBottom: 30,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 15,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    color: 'white',
    marginBottom: 3,
  },
  historyMeta: {
    fontSize: 12,
    color: '#4A90A4',
  },
  actionsSection: {
    marginBottom: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: Platform.OS === 'web' ? '30%' : width * 0.28,
  },
  actionButtonContent: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
    fontWeight: '600',
  },
  actionTitle: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#4A90A4',
    marginBottom: 15,
    lineHeight: 24,
  },
  modalLocation: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
  },
  modalTime: {
    fontSize: 14,
    color: 'white',
    marginBottom: 25,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acknowledgeButton: {
    backgroundColor: '#00D4FF',
  },
  escalateButton: {
    backgroundColor: '#FF4444',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});