import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming,
  interpolate,
  withSequence
} from 'react-native-reanimated';
import { MapPin, Zap, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Search } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const DWLR_STATIONS = [
  { id: 1, name: 'Station Alpha', lat: 28.6139, lng: 77.2090, status: 'normal', level: 4.2 },
  { id: 2, name: 'Station Beta', lat: 28.5355, lng: 77.3910, status: 'warning', level: 2.1 },
  { id: 3, name: 'Station Gamma', lat: 28.7041, lng: 77.1025, status: 'critical', level: 1.3 },
  { id: 4, name: 'Station Delta', lat: 28.4595, lng: 77.0266, status: 'normal', level: 5.8 },
  { id: 5, name: 'Station Echo', lat: 28.6692, lng: 77.4538, status: 'excellent', level: 7.2 },
];

export default function MapScreen() {
  const [selectedStation, setSelectedStation] = useState(null);
  const globeRotation = useSharedValue(0);
  const rippleAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);

  useEffect(() => {
    globeRotation.value = withRepeat(
      withTiming(360, { duration: 20000 }),
      -1,
      false
    );
    rippleAnimation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 100 })
      ),
      -1,
      false
    );
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const globeStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        rotate: `${globeRotation.value}deg`
      }],
    };
  });

  const rippleStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: interpolate(rippleAnimation.value, [0, 1], [1, 3])
      }],
      opacity: interpolate(rippleAnimation.value, [0, 0.5, 1], [0.8, 0.4, 0]),
    };
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return '#00FF88';
      case 'normal': return '#00D4FF';
      case 'warning': return '#FFB800';
      case 'critical': return '#FF4444';
      default: return '#4A90A4';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle size={16} color="#00FF88" />;
      case 'normal': return <CheckCircle size={16} color="#00D4FF" />;
      case 'warning': return <AlertTriangle size={16} color="#FFB800" />;
      case 'critical': return <AlertTriangle size={16} color="#FF4444" />;
      default: return <MapPin size={16} color="#4A90A4" />;
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
        <Text style={styles.title}>Station Map</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Search size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* 3D Globe/Map Representation */}
      <View style={styles.mapContainer}>
        <Animated.View style={[styles.globe, globeStyle]}>
          <LinearGradient
            colors={['#0077BE', '#00D4FF', '#003A5C']}
            style={styles.globeGradient}
          />
          
          {/* Animated ripples for stress zones */}
          <Animated.View style={[styles.stressZone, rippleStyle]} />
          <Animated.View style={[styles.stressZone, styles.stressZone2, rippleStyle]} />
        </Animated.View>

        {/* DWLR Station Pins */}
        <View style={styles.stationsOverlay}>
          {DWLR_STATIONS.map((station, index) => (
            <StationPin
              key={station.id}
              station={station}
              onPress={() => setSelectedStation(station)}
              style={{
                top: `${20 + index * 15}%`,
                left: `${15 + index * 18}%`,
              }}
              color={getStatusColor(station.status)}
            />
          ))}
        </View>
      </View>

      {/* Station Details */}
      {selectedStation && (
        <BlurView intensity={20} style={styles.stationDetails}>
          <View style={styles.stationHeader}>
            <Text style={styles.stationName}>{selectedStation.name}</Text>
            {getStatusIcon(selectedStation.status)}
          </View>
          <Text style={styles.stationLevel}>
            Water Level: {selectedStation.level}m
          </Text>
          <Text style={[
            styles.stationStatus,
            { color: getStatusColor(selectedStation.status) }
          ]}>
            Status: {selectedStation.status.toUpperCase()}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedStation(null)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </BlurView>
      )}

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Status Legend</Text>
        <LegendItem color="#00FF88" label="Excellent (>6m)" />
        <LegendItem color="#00D4FF" label="Normal (3-6m)" />
        <LegendItem color="#FFB800" label="Warning (1-3m)" />
        <LegendItem color="#FF4444" label="Critical (<1m)" />
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <StatCard
          title="Active Stations"
          value="5"
          icon={<MapPin size={20} color="#00D4FF" />}
        />
        <StatCard
          title="Avg Water Level"
          value="4.1m"
          icon={<Zap size={20} color="#00FF88" />}
        />
        <StatCard
          title="Critical Zones"
          value="1"
          icon={<AlertTriangle size={20} color="#FF4444" />}
        />
      </View>
    </View>
  );
}

function StationPin({ station, onPress, style, color }) {
  const pulseAnimation = useSharedValue(0);

  useEffect(() => {
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: interpolate(pulseAnimation.value, [0, 1], [1, 1.3])
      }],
    };
  });

  return (
    <TouchableOpacity
      style={[styles.stationPin, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.pinPulse, pulseStyle, { backgroundColor: color + '40' }]} />
      <View style={[styles.pinCore, { backgroundColor: color }]} />
    </TouchableOpacity>
  );
}

function LegendItem({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <BlurView intensity={15} style={styles.statCard}>
      <View style={styles.statIcon}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: '800',
    color: 'white',
  },
  searchButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  mapContainer: {
    height: Platform.OS === 'web' ? 400 : 300,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  globe: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  globeGradient: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  stressZone: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 68, 68, 0.3)',
    top: '60%',
    left: '30%',
  },
  stressZone2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    top: '20%',
    left: '70%',
  },
  stationsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  stationPin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  pinCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  stationDetails: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  stationLevel: {
    fontSize: 16,
    color: '#4A90A4',
    marginBottom: 5,
  },
  stationStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
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
  legend: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  legendLabel: {
    fontSize: 12,
    color: '#4A90A4',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statCard: {
    width: Platform.OS === 'web' ? '30%' : width * 0.28,
    padding: 15,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  statIcon: {
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
});