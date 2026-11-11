import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Alert, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Btn, Field, Chip } from '../../components/UI';
import { C } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function SetupScreen() {
  const ins = useSafeAreaInsets();
  const router = useRouter();
  const { signup } = useApp();

  // Credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Owner Info
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  
  // Birthday Dropdown States
  const [selectedYear, setSelectedYear] = useState('2000');
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedDay, setSelectedDay] = useState('01');
  
  const [sex, setSex] = useState('Female');

  // Initial Pet Info
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  
  // Microchip Toggle State
  const [hasMicrochip, setHasMicrochip] = useState<'yes' | 'no'>('yes');
  const [chip, setChip] = useState('');
  const [isLoading, setIsLoading] = useState(false); // 👈 Loading state

  // Dropdown lists generators
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 80 }, (_, i) => (currentYear - i).toString());
  const months = [
    { label: 'Jan', val: '01' }, { label: 'Feb', val: '02' }, { label: 'Mar', val: '03' },
    { label: 'Apr', val: '04' }, { label: 'May', val: '05' }, { label: 'Jun', val: '06' },
    { label: 'Jul', val: '07' }, { label: 'Aug', val: '08' }, { label: 'Sep', val: '09' },
    { label: 'Oct', val: '10' }, { label: 'Nov', val: '11' }, { label: 'Dec', val: '12' },
  ];
  const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const handleRegister = async () => {
    // Check for missing inputs and notify user specifically
    if (!email.trim()) {
      Alert.alert('Missing Information ⚠️', 'Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Missing Information ⚠️', 'Please create a password for your account.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Missing Information ⚠️', 'Please enter your full name as the owner.');
      return;
    }
    if (!age.trim()) {
      Alert.alert('Missing Information ⚠️', 'Please enter your declared age.');
      return;
    }
    if (!petName.trim()) {
      Alert.alert('Missing Information ⚠️', 'Please enter your initial pet name.');
      return;
    }
    if (hasMicrochip === 'yes' && !chip.trim()) {
      Alert.alert('Missing Information ⚠️', 'You selected that you have an ID/Microchip. Please enter the microchip number or switch to "No ID Yet".');
      return;
    }

    // Age & Birthday Matching Validation Logic
    const birthDate = new Date(`${selectedYear}-${selectedMonth}-${selectedDay}`);
    const today = new Date();
    
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    const inputAgeNum = parseInt(age.trim(), 10);
    if (isNaN(inputAgeNum) || Math.abs(calculatedAge - inputAgeNum) > 1) {
      Alert.alert(
        'Age Mismatch ⚠️',
        `The birth date you selected (${selectedYear}-${selectedMonth}-${selectedDay}) corresponds to ~${calculatedAge} years old, but you entered an age of ${inputAgeNum}. Please correct your age or birth date to match.`
      );
      return;
    }

    setIsLoading(true); // 👈 Show loading screen
    setTimeout(async () => {
      const formattedBirthday = `${selectedYear}-${selectedMonth}-${selectedDay}`;
      const finalChipValue = hasMicrochip === 'yes' && chip.trim() ? chip.trim() : 'No Microchip Assigned Yet';

      const success = await signup(
        email,
        password,
        { name, age: inputAgeNum.toString(), birthday: formattedBirthday, sex },
        {
          name: petName,
          emo: '🐱',
          species: 'Cat',
          breed: breed || 'Domestic Shorthair',
          allergy: 'None',
          chip: finalChipValue,
          vax: true,
        }
      );

      setIsLoading(false); // 👈 Hide loading screen

      if (success) {
        router.replace('/(tabs)/home');
      } else {
        Alert.alert('Registration Failed', 'An account with this email already exists. Please sign in instead.');
      }
    }, 600);
  };

  // Immersive Loading Screen Overlay
  if (isLoading) {
    return (
      <View style={[s.body, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" color={C.pri} />
        <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink, marginTop: 16 }}>Creating your Scanimals account...</Text>
        <Text style={{ fontSize: 13, color: C.ink2, marginTop: 4 }}>Registering owner credentials and initial pet pass</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[s.body, { paddingTop: ins.top + 16 }]}>
      <Chip t="✨ Multi-Account Signup" />
      <Text style={s.h1}>Create Account</Text>
      <Text style={s.sub}>Set up your login credentials, verified age, birthday, and initial pet passport.</Text>

      <View style={s.card}>
        <Text style={s.sectionTitle}>1. Account Credentials</Text>
        <Field label="Email Address" placeholder="you@domain.com" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Field label="Password" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />

        <View style={s.divider} />

        <Text style={s.sectionTitle}>2. Owner Details & Verified Age</Text>
        <Field label="Full Name" placeholder="e.g. Alex Rivera" value={name} onChangeText={setName} />
        <Field label="Declared Age (Must match birthday)" placeholder="e.g. 20" value={age} onChangeText={setAge} keyboardType="numeric" />

        {/* Birthday Dropdown Selectors */}
        <Text style={s.fieldLabel}>Birthday (Year / Month / Day)</Text>
        <View style={s.dropdownRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scrollSelectRow}>
            {years.map((y) => (
              <Pressable
                key={y}
                style={[s.selectChip, selectedYear === y && s.selectChipActive]}
                onPress={() => setSelectedYear(y)}
              >
                <Text style={[s.selectTxt, selectedYear === y && s.selectTxtActive]}>{y}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={s.dropdownRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scrollSelectRow}>
            {months.map((m) => (
              <Pressable
                key={m.val}
                style={[s.selectChip, selectedMonth === m.val && s.selectChipActive]}
                onPress={() => setSelectedMonth(m.val)}
              >
                <Text style={[s.selectTxt, selectedMonth === m.val && s.selectTxtActive]}>{m.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={s.dropdownRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.scrollSelectRow}>
            {days.map((d) => (
              <Pressable
                key={d}
                style={[s.selectChip, selectedDay === d && s.selectChipActive]}
                onPress={() => setSelectedDay(d)}
              >
                <Text style={[s.selectTxt, selectedDay === d && s.selectTxtActive]}>{d}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <Text style={s.fieldLabel}>Sex</Text>
        <View style={s.sexRow}>
          {['Female', 'Male', 'Prefer not to say'].map((item) => (
            <Pressable
              key={item}
              style={[s.sexChip, sex === item && s.sexChipActive]}
              onPress={() => setSex(item)}
            >
              <Text style={[s.sexTxt, sex === item && s.sexTxtActive]}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <View style={s.divider} />

        <Text style={s.sectionTitle}>3. Initial Pet Registration</Text>
        <Field label="Pet Name" placeholder="e.g. Simba" value={petName} onChangeText={setPetName} />
        <Field label="Breed" placeholder="e.g. Tabby Cat" value={breed} onChangeText={setBreed} />

        {/* Microchip / ID Status Selection Toggle */}
        <Text style={s.fieldLabel}>Microchip / ID Status</Text>
        <View style={s.sexRow}>
          <Pressable
            style={[s.sexChip, hasMicrochip === 'yes' && s.sexChipActive]}
            onPress={() => setHasMicrochip('yes')}
          >
            <Text style={[s.sexTxt, hasMicrochip === 'yes' && s.sexTxtActive]}>Have ID / Microchip</Text>
          </Pressable>
          <Pressable
            style={[s.sexChip, hasMicrochip === 'no' && s.sexChipActive]}
            onPress={() => setHasMicrochip('no')}
          >
            <Text style={[s.sexTxt, hasMicrochip === 'no' && s.sexTxtActive]}>No ID Yet</Text>
          </Pressable>
        </View>

        {hasMicrochip === 'yes' && (
          <Field label="Microchip Number" placeholder="e.g. 985112999888" value={chip} onChangeText={setChip} />
        )}

        <View style={{ height: 6 }} />
        <Btn kind="tint" t="Register" onPress={handleRegister} />
        <Btn kind="out" t="← Back to Sign In" onPress={() => router.replace('/(auth)')} />
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  body: { padding: 16, gap: 14, backgroundColor: C.bg, flexGrow: 1 },
  h1: { fontSize: 26, lineHeight: 32, fontWeight: '800', color: C.ink },
  sub: { fontSize: 14, lineHeight: 20, color: C.ink2 },
  card: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 20, padding: 16, gap: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: C.priDark || '#059669', marginTop: 4 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 8 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: C.ink, marginTop: 4 },
  dropdownRow: { flexDirection: 'row', alignItems: 'center' },
  scrollSelectRow: { gap: 6, paddingVertical: 2 },
  selectChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: C.field },
  selectChipActive: { backgroundColor: C.pri, borderColor: C.pri },
  selectTxt: { fontSize: 12, color: C.ink2, fontWeight: '600' },
  selectTxtActive: { color: '#fff', fontWeight: '800' },
  sexRow: { flexDirection: 'row', gap: 8 },
  sexChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: C.line },
  sexChipActive: { backgroundColor: C.pri, borderColor: C.pri },
  sexTxt: { fontSize: 12, color: C.ink2, fontWeight: '600' },
  sexTxtActive: { color: C.ink, fontWeight: '800' },
});