import React, { useMemo, useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, Platform, useWindowDimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/Themed';
import { GradientBackground } from '@/components/GradientBackground';
import { TopHeader } from '@/components/TopHeader';
import { useExchangeRates } from '@/hooks/use-exchange-rates';
import { useCalculatorStore } from '@/stores/calculator-store';
import { CalculatorItem } from '@/components/CalculatorItem';
import { formatNumber } from '@/utils/format';
import { Plus, Trash2, DollarSign, Euro, RotateCcw, Copy } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

export default function CalculatorScreen() {
  const { data } = useExchangeRates();
  const { items, addItem, clearAll } = useCalculatorStore();
  const [selectedUnit, setSelectedUnit] = useState<'USD' | 'EUR' | 'USDT'>('USD');
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 768;

  // Calculate totals
  const totalBase = useMemo(() => {
    return items.reduce((sum, item) => {
      const val = parseFloat(item.amount.replace(',', '.')) || 0;
      return sum + val;
    }, 0);
  }, [items]);

  const getRateValue = (symbol: string) => {
    const rate = data?.rates.find(r => r.label === symbol);
    if (!rate) return 0;
    return parseFloat(rate.value.replace(',', '.')) || 0;
  };

  const rateUSD = getRateValue('USD');
  const rateEUR = getRateValue('EUR');
  const rateUSDT = getRateValue('USDT');

  const totalBcvUSD = totalBase * rateUSD;
  const totalBcvEUR = totalBase * rateEUR;
  const totalBinanceUSDT = totalBase * rateUSDT;

  const unitLabels = {
    'USDT': 'USDT',
    'USD': 'USD BCV',
    'EUR': 'EURO BCV'
  };

  const handleCopy = async () => {
    const text = `${formatNumber(totalBase)} ${unitLabels[selectedUnit]}\nBs. ${formatNumber(currentVesTotal)}`;
    await Clipboard.setStringAsync(text);
  };

  const currentVesTotal = useMemo(() => {
    switch (selectedUnit) {
      case 'USD': return totalBcvUSD;
      case 'EUR': return totalBcvEUR;
      case 'USDT': return totalBinanceUSDT;
      default: return totalBcvUSD;
    }
  }, [selectedUnit, totalBcvUSD, totalBcvEUR, totalBinanceUSDT]);

  return (
    <SafeAreaView style={styles.container}>
      <GradientBackground>
        <StatusBar barStyle="light-content" />
        <TopHeader />

        <View style={[styles.content, isDesktop && styles.desktopContent]}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeaderRow}>
              <View style={styles.headerActions}>
                <View style={styles.customToggleContainer}>
                  {(['USDT', 'USD', 'EUR'] as const).map((unit) => {
                    const isActive = selectedUnit === unit;
                    return (
                      <TouchableOpacity
                        key={unit}
                        style={[styles.toggleSection, isActive && styles.activeToggleSection]}
                        onPress={() => setSelectedUnit(unit)}
                        activeOpacity={0.8}
                      >
                        {unit === 'USDT' ? (
                          <Image source={require('../assets/images/logos/usdt.png')} style={{ width: 16, height: 16 }} />
                        ) : unit === 'USD' ? (
                          <DollarSign size={16} color={isActive ? '#1B6B3E' : '#F1C40F'} />
                        ) : (
                          <Euro size={16} color={isActive ? '#1B6B3E' : '#F1C40F'} />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <TouchableOpacity onPress={clearAll} style={styles.headerResetButton}>
                  <RotateCcw size={18} color="#F1C40F" />
                </TouchableOpacity>
              </View>
              <Text style={styles.summaryTitle}>Calculadora</Text>
            </View>
            
            <View style={styles.totalsStack}>
              <View style={styles.totalBase}>
                <View style={[styles.totalIconContainer, { marginRight: 12 }]}>
                  {selectedUnit === 'USDT' ? (
                    <Image source={require('../assets/images/logos/usdt.png')} style={styles.totalIconImage} />
                  ) : selectedUnit === 'USD' ? (
                    <DollarSign size={32} color="#F1C40F" />
                  ) : (
                    <Euro size={32} color="#F1C40F" />
                  )}
                </View>
                <Text style={styles.totalBaseAmount}>{formatNumber(totalBase)}</Text>
              </View>

              <Text style={styles.totalVesSub}>
                Bs. {formatNumber(currentVesTotal)}
              </Text>
            </View>

            <View style={styles.summaryFooterRow}>
              <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
                <Copy size={20} color="#F1C40F" />
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CalculatorItem item={item} />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No hay items. Agrega uno debajo.</Text>
              </View>
            }
          />

          <TouchableOpacity style={styles.addButton} onPress={addItem}>
            <Plus size={28} color="#F1C40F" />
          </TouchableOpacity>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    width: '100%',
  },
  desktopContent: {
    maxWidth: 600,
    alignSelf: 'center',
  },
  summaryCard: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1B6B3E',
  },
  summaryHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  headerResetButton: {
    backgroundColor: '#1B6B3E',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#448A44',
  },
  summaryFooterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  copyButton: {
    backgroundColor: '#1B6B3E',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#448A44',
  },
  totalsStack: {
    alignItems: 'center',
    gap: 4,
  },
  totalBase: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  totalBaseAmount: {
    color: '#fff',
    fontSize: 56,
    fontWeight: 'bold',
  },
  totalIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalIconImage: {
    width: 32,
    height: 32,
  },
  totalVesSub: {
    color: '#F1C40F',
    fontSize: 24,
    fontWeight: 'bold',
    opacity: 0.9,
  },
  customToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1B6B3E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#448A44',
    padding: 2,
  },
  toggleSection: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeToggleSection: {
    backgroundColor: '#F1C40F',
  },
  toggleText: {
    color: '#F1C40F',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeToggleText: {
    color: '#1B6B3E',
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(27, 107, 62, 0.4)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1B6B3E',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#1B6B3E',
    padding: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#448A44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 20,
    alignSelf: 'center',
    // Shadow for premium feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
