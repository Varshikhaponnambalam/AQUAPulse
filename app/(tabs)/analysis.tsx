import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withRepeat,
  interpolate
} from 'react-native-reanimated';
import { Calendar, CloudRain, Droplets, TrendingUp } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function Analysis() {
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const chartAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(0);

  useEffect(() => {
    chartAnimation.value = withTiming(1, { duration: 1500 });
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  const chartStyle = useAnimatedStyle(() => {
    return {
      opacity: chartAnimation.value,
      transform: [{
        scale: interpolate(chartAnimation.value, [0, 1], [0.8, 1])
      }],
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        scale: interpolate(pulseAnimation.value, [0, 1], [1, 1.1])
      }],
    };
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#001A2E', '#003A5C', '#0077BE']}
        style={styles.backgroundGradient}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Analysis & Insights</Text>
          <Text style={styles.subtitle}>Comprehensive groundwater analytics</Text>
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['daily', 'weekly', 'monthly', 'seasonal'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.activePeriodText
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Chart */}
        <Animated.View style={[styles.chartContainer, chartStyle]}>
          <BlurView intensity={20} style={styles.chartBackground}>
            <Text style={styles.chartTitle}>Water Level Trends</Text>
            <View style={styles.chart}>
              <ChartLine data={[65, 72, 68, 75, 71, 78, 74]} color="#00D4FF" />
              <ChartLine data={[45, 52, 48, 55, 51, 58, 54]} color="#00FF88" />
            </View>
            <View style={styles.chartLegend}>
              <LegendItem color="#00D4FF" label="Current Level" />
              <LegendItem color="#00FF88" label="Previous Period" />
            </View>
          </BlurView>
        </Animated.View>

        {/* Forecast Section */}
        <View style={styles.forecastSection}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          <BlurView intensity={15} style={styles.forecastContainer}>
            <Animated.View style={pulseStyle}>
              <View style={styles.forecastCard}>
                <Text style={styles.forecastValue}>+2.3m</Text>
                <Text style={styles.forecastLabel}>Expected Rise</Text>
                <View style={styles.forecastIcon}>
                  <TrendingUp size={24} color="#00FF88" />
                </View>
              </View>
            </Animated.View>
          </BlurView>
        </View>

        {/* Rainfall Comparison */}
        <View style={styles.comparisonSection}>
          <Text style={styles.sectionTitle}>Rainfall vs Groundwater</Text>
          <View style={styles.comparisonCards}>
            <ComparisonCard
              icon={<CloudRain size={32} color="#4A90E2" />}
              title="Rainfall"
              value="145mm"
              subtitle="This month"
              trend="+15%"
              color="#4A90E2"
            />
            <ComparisonCard
              icon={<Droplets size={32} color="#00D4FF" />}
              title="Recharge"
              value="2.8m"
              subtitle="Water level"
              trend="+8%"
              color="#00D4FF"
            />
          </View>
        </View>

        {/* Historical Data */}
        <View style={styles.historicalSection}>
          <Text style={styles.sectionTitle}>Historical Insights</Text>
          <View style={styles.timelineContainer}>
            <TimelineItem
              year="2024"
              event="Record high recharge after monsoon"
              value="+45%"
              color="#00FF88"
            />
            <TimelineItem
              year="2023"
              event="Drought period - conservation measures"
              value="-23%"
              color="#FFB800"
            />
            <TimelineItem
              year="2022"
              event="Normal precipitation levels"
              value="+5%"
              color="#00D4FF"
            />
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Key Performance Metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricCard title="Recharge Efficiency" value="87%" color="#00FF88" />
            <MetricCard title="Water Quality" value="8.4/10" color="#00D4FF" />
            <MetricCard title="Depletion Rate" value="2.1L/min" color="#FFB800" />
            <MetricCard title="Recovery Time" value="4.2 days" color="#4A90E2" />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ChartLine({ data, color }) {
  return (
    <View style={styles.chartLine}>
      {data.map((value, index) => (
        <View
          key={index}
          style={[
            styles.chartBar,
            {
              height: value * 2,
              backgroundColor: color,
            }
          ]}
        />
      ))}
    </View>
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

function ComparisonCard({ icon, title, value, subtitle, trend, color }) {
  return (
    <BlurView intensity={15} style={styles.comparisonCard}>
      <View style={styles.comparisonHeader}>
        {icon}
        <Text style={[styles.comparisonTrend, { color }]}>{trend}</Text>
      </View>
      <Text style={styles.comparisonValue}>{value}</Text>
      <Text style={styles.comparisonTitle}>{title}</Text>
      <Text style={styles.comparisonSubtitle}>{subtitle}</Text>
    </BlurView>
  );
}

function TimelineItem({ year, event, value, color }) {
  return (
    <View style={styles.timelineItem}>
      <View style={[styles.timelineDot, { backgroundColor: color }]} />
      <View style={styles.timelineContent}>
        <Text style={styles.timelineYear}>{year}</Text>
        <Text style={styles.timelineEvent}>{event}</Text>
        <Text style={[styles.timelineValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

function MetricCard({ title, value, color }) {
  return (
    <BlurView intensity={10} style={styles.metricCard}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
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
    fontSize: Platform.OS === 'web' ? 36 : 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#4A90A4',
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    justifyContent: 'space-between',
  },
  periodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activePeriodButton: {
    backgroundColor: '#00D4FF',
  },
  periodText: {
    color: '#4A90A4',
    fontSize: 14,
    fontWeight: '600',
  },
  activePeriodText: {
    color: 'white',
  },
  chartContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  chartBackground: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 20,
  },
  chart: {
    height: 200,
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  chartLine: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 10,
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
    minHeight: 10,
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendLabel: {
    color: '#4A90A4',
    fontSize: 12,
  },
  forecastSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    marginBottom: 15,
  },
  forecastContainer: {
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  forecastCard: {
    padding: 20,
    alignItems: 'center',
  },
  forecastValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#00FF88',
    marginBottom: 5,
  },
  forecastLabel: {
    fontSize: 16,
    color: '#4A90A4',
    marginBottom: 15,
  },
  forecastIcon: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
  },
  comparisonSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  comparisonCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  comparisonCard: {
    width: Platform.OS === 'web' ? '48%' : width * 0.42,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  comparisonTrend: {
    fontSize: 14,
    fontWeight: '600',
  },
  comparisonValue: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 5,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 3,
  },
  comparisonSubtitle: {
    fontSize: 12,
    color: '#4A90A4',
  },
  historicalSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  timelineContainer: {
    paddingLeft: 10,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 20,
  },
  timelineContent: {
    flex: 1,
  },
  timelineYear: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    marginBottom: 3,
  },
  timelineEvent: {
    fontSize: 14,
    color: '#4A90A4',
    marginBottom: 3,
  },
  timelineValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  metricsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: Platform.OS === 'web' ? '48%' : width * 0.42,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    marginBottom: 15,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  metricTitle: {
    fontSize: 12,
    color: '#4A90A4',
    textAlign: 'center',
  },
});