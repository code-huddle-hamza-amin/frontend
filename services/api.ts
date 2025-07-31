export const BASE_URL = 'http://192.168.100.191:8000';

export async function googleAuth({ idToken, serverAuthCode, user, scopes }: {
  idToken: string;
  serverAuthCode: string;
  user: any;
  scopes: string[];
}) {
  try {
    console.log('Making API call to:', `${BASE_URL}/auth/google`);
    
    // Add 2 second delay to resolve token timing issue
    await new Promise(resolve => setTimeout(resolve, 2000));
    
  const res = await fetch(`${BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, serverAuthCode, user, scopes })
  });
    
    console.log('API Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('API Success:', data);
    
    // Check if response contains user data despite backend errors
    if (data.error && data.errorDetails) {
      console.warn('Backend returned error but may have user data:', data.errorDetails);
      // If we have user data, we can still proceed
      if (data.email && data.user_id) {
        console.log('User data found despite error, proceeding with authentication');
        return data;
      }
    }
    
    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}

// Generate UUID endpoint
export async function generateUUID() {
  try {
    console.log('Generating UUID...');
    const res = await fetch(`${BASE_URL}/generate-uuid`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('UUID Generation Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('UUID Generated:', data);
    return data;
  } catch (error) {
    console.error('UUID Generation Error:', error);
    throw error;
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    console.log('Getting user by email:', email);
    const res = await fetch(`${BASE_URL}/user/medium/email?user_id=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Get User Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('User data retrieved:', data);
    return data;
  } catch (error) {
    console.error('Get User Error:', error);
    throw error;
  }
}

// Get user by Google User ID (more reliable for Google users)
export async function getUserByGoogleId(googleUserId: string) {
  try {
    console.log('Getting user by Google ID:', googleUserId);
    const res = await fetch(`${BASE_URL}/user/medium/gmail_token?user_id=${encodeURIComponent(googleUserId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Get User by Google ID Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('User data retrieved by Google ID:', data);
    return data;
  } catch (error) {
    console.error('Get User by Google ID Error:', error);
    throw error;
  }
}

// Create new user
export async function createUser(userData: {
  id: string;
  name: string;
  pass: string;
  gmail: string;
  net_amount?: number;
  gmail_token?: string | null;
}) {
  try {
    console.log('Creating new user:', userData);
    const res = await fetch(`${BASE_URL}/user/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('User Creation Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('User created successfully:', data);
    return data;
  } catch (error) {
    console.error('User Creation Error:', error);
    throw error;
  }
}

// Update user's gmail_token
export async function updateUserGmailToken(userId: string, gmailToken: string) {
  try {
    console.log('Updating user gmail_token:', { userId, gmailToken });
    const res = await fetch(`${BASE_URL}/user/update-gmail-token?user_id=${encodeURIComponent(userId)}&gmail_token=${encodeURIComponent(gmailToken)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Update Gmail Token Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Gmail token updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Update Gmail Token Error:', error);
    throw error;
  }
}

// Test function to check if backend is reachable
export async function testBackendConnection() {
  try {
    console.log('Testing connection to:', BASE_URL);
    const res = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (res.ok) {
      console.log('Backend is reachable');
      return true;
    } else {
      console.log('Backend responded with status:', res.status);
      return false;
    }
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
}

// Test general internet connectivity
export async function testInternetConnection() {
  try {
    console.log('Testing internet connection...');
    const res = await fetch('https://www.google.com', {
      method: 'HEAD'
    });
    console.log('Internet connection successful');
    return true;
  } catch (error) {
    console.error('Internet connection failed:', error);
    return false;
  }
}

// Email authentication with backend integration
export async function emailAuthSignUp(email: string, password: string, name: string) {
  try {
    console.log('Email sign up with backend:', email);
    
    // First, generate UUID for the user
    const uuidResponse = await generateUUID();
    const userId = uuidResponse.uuid;
    
    // Check if user already exists
    const userExists = await getUserByEmail(email);
    
    if (userExists.user) {
      return {
        error: true,
        errorDetails: 'User with this email already exists',
        isNewUser: false
      };
    }
    
    // Create user in backend
    const userData = {
      id: userId,
      name: name,
      pass: password, // Note: In production, this should be hashed
      gmail: email,
      net_amount: 0,
      gmail_token:null
    };
    
    const createResponse = await createUser(userData);
    
    // Get the complete user data
    const userResponse = await getUserByEmail(email);
    
    return {
      error: false,
      isNewUser: true,
      user: userResponse.user,
      personalId: userResponse.user.personal_id
    };
  } catch (error) {
    console.error('Email sign up error:', error);
    return {
      error: true,
      errorDetails: error instanceof Error ? error.message : 'Unknown error occurred',
      isNewUser: false
    };
  }
}

export async function emailAuthSignIn(email: string, password: string) {
  try {
    console.log('Email sign in with backend:', email);
    
    // Check if user exists
    const userExists = await authenticateUser(email, password);
    
    if (!userExists.exists) {
      return {
        error: true,
        errorDetails: 'User not found. Please sign up first.',
        isNewUser: false
      };
    }
    console.log('User found:', userExists.user);
    
    return {
      error: false,
      isNewUser: false,
      user: userExists.user,
      personalId: userExists.user.personal_id
    };
  } catch (error) {
    console.error('Email sign in error:', error);
    return {
      error: true,
      errorDetails: error instanceof Error ? error.message : 'Unknown error occurred',
      isNewUser: false
    };
  }
}

// Add a proper authentication endpoint for email/password
export async function authenticateUser(email: string, password: string) {
  try {
    console.log('Authenticating user:', email);
    const res = await fetch(`${BASE_URL}/auth/email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Authentication Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Authentication successful:', data);
    return data;
  } catch (error) {
    console.error('Authentication Error:', error);
    throw error;
  }
}

// Get OTP for email verification
export async function getOTP(email: string) {
  try {
    console.log('Getting OTP for:', email);
    const res = await fetch(`${BASE_URL}/user/get_otp?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Get OTP Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('OTP sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Get OTP Error:', error);
    throw error;
  }
}

// Verify OTP
export async function verifyOTP(email: string, otpCode: string) {
  try {
    console.log('Verifying OTP for:', email);
    const res = await fetch(`${BASE_URL}/user/verify_otp?email=${encodeURIComponent(email)}&otp_code=${encodeURIComponent(otpCode)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Verify OTP Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('OTP verified successfully:', data);
    return data;
  } catch (error) {
    console.error('Verify OTP Error:', error);
    throw error;
  }
}

// Change password
export async function changePassword(email: string, newPassword: string) {
  try {
    console.log('Changing password for:', email);
    const res = await fetch(`${BASE_URL}/user/change-password?email=${encodeURIComponent(email)}&new_password=${encodeURIComponent(newPassword)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Change Password Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Password changed successfully:', data);
    return data;
  } catch (error) {
    console.error('Change Password Error:', error);
    throw error;
  }
} 

// Get recent transactions for a user (max 7)
export async function getRecentTransactions(userId: string) {
  try {
    console.log('Getting recent transactions for user:', userId);
    const res = await fetch(`${BASE_URL}/user/recent-transactions?user_id=${encodeURIComponent(userId)}&limit=7`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Get Recent Transactions Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Get Recent Transactions Error:', error);
    throw error;
  }
}

// Get connected WhatsApp phones for a user
export async function getConnectedWhatsAppPhones(userId: string) {
  try {
    console.log('Getting connected WhatsApp phones for user:', userId);
    const res = await fetch(`${BASE_URL}/whatsapp/connected-phones?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Get WhatsApp Phones Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('WhatsApp phones retrieved:', data);
    return data;
  } catch (error) {
    console.error('Get WhatsApp Phones Error:', error);
    throw error;
  }
}

// Send WhatsApp OTP
export async function sendWhatsAppOTP(phoneNumber: string,email:string) {
  try {
    console.log('Sending WhatsApp OTP to:', phoneNumber);
    const res = await fetch(`${BASE_URL}/whatsapp/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber,email:email })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Send WhatsApp OTP Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('WhatsApp OTP sent:', data);
    return data;
  } catch (error) {
    console.error('Send WhatsApp OTP Error:', error);
    throw error;
  }
}

// Connect WhatsApp number (after OTP verification)
export async function connectWhatsAppNumber(userId: string, phoneNumber: string) {
  try {
    console.log('Connecting WhatsApp number:', phoneNumber, 'for user:', userId);
    const res = await fetch(`${BASE_URL}/whatsapp/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, number: phoneNumber })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Connect WhatsApp Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('WhatsApp connection response:', data);
    return data;
  } catch (error) {
    console.error('Connect WhatsApp Error:', error);
    throw error;
  }
}

// Store Gmail account with refresh token
export async function storeGmailAccount(gmailAccountData: {
  acc_id: string;
  acc_token: string;
  refresh_token: string;
  user_id: string;
}) {
  try {
    console.log('Storing Gmail account:', gmailAccountData);
    const res = await fetch(`${BASE_URL}/gmail/store-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gmailAccountData)
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Store Gmail Account Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Gmail account stored:', data);
    return data;
  } catch (error) {
    console.error('Store Gmail Account Error:', error);
    throw error;
  }
}

// Get connected Gmail accounts for a user
export async function getConnectedGmailAccounts(userId: string) {
  try {
    console.log('Getting connected Gmail accounts for user:', userId);
    const res = await fetch(`${BASE_URL}/gmail/connected-accounts?user_id=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Get Gmail Accounts Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Gmail accounts retrieved:', data);
    return data;
  } catch (error) {
    console.error('Get Gmail Accounts Error:', error);
    throw error;
  }
}

// Update Gmail account tokens
export async function updateGmailAccountTokens(accId: string, accToken: string, refreshToken: string) {
  try {
    console.log('Updating Gmail account tokens for:', accId);
    const res = await fetch(`${BASE_URL}/gmail/update-tokens`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        acc_id: accId, 
        acc_token: accToken, 
        refresh_token: refreshToken 
      })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Update Gmail Tokens Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Gmail tokens updated:', data);
    return data;
  } catch (error) {
    console.error('Update Gmail Tokens Error:', error);
    throw error;
  }
}

// Delete Gmail account
export async function deleteGmailAccount(accId: string) {
  try {
    console.log('Deleting Gmail account:', accId);
    const res = await fetch(`${BASE_URL}/gmail/delete-account?acc_id=${encodeURIComponent(accId)}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Delete Gmail Account Error:', errorText);
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }
    
    const data = await res.json();
    console.log('Gmail account deleted:', data);
    return data;
  } catch (error) {
    console.error('Delete Gmail Account Error:', error);
    throw error;
  }
}