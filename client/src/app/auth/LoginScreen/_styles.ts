import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  scrollContent: {
    flex: 1,
  },
  
  // Banner de Sucesso
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  successTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  successSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.95,
    lineHeight: 18,
  },
  
  // Banner de Erro
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#E74C3C',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  errorText: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 12,
    lineHeight: 18,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#4ECDC4',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4ECDC4',
    marginTop: 12,
    letterSpacing: 1,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Form Section
  formSection: {
    flex: 1,
    marginBottom: 24,
  },
  googleLogin: {
    width: "100%",
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#E1E8ED",
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleLoginText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E1E8ED',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#95A5A6',
    fontWeight: '500',
  },

  // Input Container
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    marginLeft: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E1E8ED',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperFocused: {
    borderColor: '#4ECDC4',
    backgroundColor: '#F8FFFE',
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C3E50',
    paddingVertical: 0,
    height: '100%',
  },

  // Forgot Password
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 4,
    marginBottom: 32,
  },
  forgotPasswordButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    color: '#4ECDC4',
    fontSize: 14,
    fontWeight: '600',
  },

  // Login Button
  loginButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 320,
    height: 56,
    backgroundColor: '#4ECDC4',
    borderRadius: 12,
    shadowColor: '#4ECDC4',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#A0D9D6',
  },
  buttonIcon: {
    marginRight: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Footer Section
  footerSection: {
    alignItems: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  signupText: {
    fontSize: 15,
    color: '#7F8C8D',
    marginRight: 6,
  },
  signupButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  signupLinkText: {
    color: '#4ECDC4',
    fontSize: 15,
    fontWeight: '700',
  },

  // Shadow Button
  shadowButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default styles