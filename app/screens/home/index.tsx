import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import GoogleSignInButton from '../../../components/auth/GoogleSignInButton';

export default function HomeScreen() {
  const [backendData, setBackendData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleGoogleSignInSuccess = (data: any) => {
    console.log('✅ Google Sign-in Success:', data);
    setBackendData(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      
      <GoogleSignInButton
        onSuccess={handleGoogleSignInSuccess}
        setUserInfo={setUserInfo}
      />

      {backendData && (
        <ScrollView style={styles.responseContainer}>
          <Text style={styles.responseTitle}>Backend Response:</Text>
          <Text style={styles.responseText} selectable>
            {JSON.stringify(backendData, null, 2)}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  responseContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  responseText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
}); 