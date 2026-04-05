'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Settings, 
  Save, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Download,
  Upload,
  Eye,
  EyeOff,
  Check,
  X,
  AlertTriangle,
  Info
} from 'lucide-react'

interface GeneralSettings {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  address: string
  currency: string
  timezone: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  orderNotifications: boolean
  inquiryNotifications: boolean
  newsletterNotifications: boolean
  maintenanceMode: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  sessionTimeout: number
  passwordMinLength: number
  requireStrongPassword: boolean
  loginAttempts: number
}

interface AppearanceSettings {
  primaryColor: string
  secondaryColor: string
  darkMode: boolean
  compactMode: boolean
  logoUrl: string
  faviconUrl: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('general')
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [showPassword, setShowPassword] = useState(false)

  // Settings state
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'Afri Processors Limited',
    siteDescription: 'Premium African agricultural products and processing solutions',
    contactEmail: 'info@afriprocessors.com',
    contactPhone: '+256 784 123 456',
    address: 'Kampala, Uganda',
    currency: 'UGX',
    timezone: 'Africa/Kampala',
    language: 'en'
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    orderNotifications: true,
    inquiryNotifications: true,
    newsletterNotifications: false,
    maintenanceMode: false
  })

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requireStrongPassword: true,
    loginAttempts: 5
  })

  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    primaryColor: '#10b981',
    secondaryColor: '#6b7280',
    darkMode: false,
    compactMode: false,
    logoUrl: '/images/logo.png',
    faviconUrl: '/favicon.ico'
  })

  useEffect(() => {
    // Check session
    const sessionData = localStorage.getItem('adminSession')
    
    if (!sessionData) {
      router.push('/admin/login')
      return
    }
    
    let userData
    try {
      userData = JSON.parse(sessionData)
      setUser(userData)
    } catch {
      router.push('/admin/login')
      return
    }

    // Load settings from localStorage or API
    const savedGeneral = localStorage.getItem('admin_general_settings')
    const savedNotifications = localStorage.getItem('admin_notification_settings')
    const savedSecurity = localStorage.getItem('admin_security_settings')
    const savedAppearance = localStorage.getItem('admin_appearance_settings')

    if (savedGeneral) setGeneralSettings(JSON.parse(savedGeneral))
    if (savedNotifications) setNotificationSettings(JSON.parse(savedNotifications))
    if (savedSecurity) setSecuritySettings(JSON.parse(savedSecurity))
    if (savedAppearance) setAppearanceSettings(JSON.parse(savedAppearance))

    setIsLoading(false)
  }, [router])

  const handleSaveSettings = async (section: string) => {
    setSaveStatus('saving')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Save to localStorage (in production, save to backend)
      switch (section) {
        case 'general':
          localStorage.setItem('admin_general_settings', JSON.stringify(generalSettings))
          break
        case 'notifications':
          localStorage.setItem('admin_notification_settings', JSON.stringify(notificationSettings))
          break
        case 'security':
          localStorage.setItem('admin_security_settings', JSON.stringify(securitySettings))
          break
        case 'appearance':
          localStorage.setItem('admin_appearance_settings', JSON.stringify(appearanceSettings))
          break
      }
      
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  const handleExportSettings = () => {
    const allSettings = {
      general: generalSettings,
      notifications: notificationSettings,
      security: securitySettings,
      appearance: appearanceSettings
    }
    
    const dataStr = JSON.stringify(allSettings, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `admin-settings-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string)
          
          if (importedSettings.general) setGeneralSettings(importedSettings.general)
          if (importedSettings.notifications) setNotificationSettings(importedSettings.notifications)
          if (importedSettings.security) setSecuritySettings(importedSettings.security)
          if (importedSettings.appearance) setAppearanceSettings(importedSettings.appearance)
          
          setSaveStatus('success')
          setTimeout(() => setSaveStatus('idle'), 2000)
        } catch (error) {
          setSaveStatus('error')
          setTimeout(() => setSaveStatus('idle'), 2000)
        }
      }
      reader.readAsText(file)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-600">
            Manage your system settings and preferences
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleExportSettings}
            className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 w-full sm:w-auto"
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Export
          </button>
          <label className="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer w-full sm:w-auto">
            <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus !== 'idle' && (
        <div className={`rounded-md p-4 ${
          saveStatus === 'saving' ? 'bg-blue-50 text-blue-800' :
          saveStatus === 'success' ? 'bg-green-50 text-green-800' :
          'bg-red-50 text-red-800'
        }`}>
          <div className="flex">
            {saveStatus === 'saving' && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>}
            {saveStatus === 'success' && <Check className="h-4 w-4 mr-2" />}
            {saveStatus === 'error' && <X className="h-4 w-4 mr-2" />}
            <p className="text-sm font-medium">
              {saveStatus === 'saving' ? 'Saving settings...' :
               saveStatus === 'success' ? 'Settings saved successfully!' :
               'Error saving settings. Please try again.'}
            </p>
          </div>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex -mb-px min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-3 sm:py-4 px-3 sm:px-6 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 1)}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-3 sm:p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">General Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={generalSettings.contactPhone}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option value="UGX">UGX - Ugandan Shilling</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option value="Africa/Kampala">Africa/Kampala</option>
                      <option value="Africa/Nairobi">Africa/Nairobi</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                      className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option value="en">English</option>
                      <option value="fr">French</option>
                      <option value="es">Spanish</option>
                      <option value="sw">Swahili</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 sm:mt-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Site Description
                  </label>
                  <textarea
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                    rows={3}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>
                <div className="mt-4 sm:mt-6">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                    rows={2}
                    className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('general')}
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Save General Settings
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive email notifications for important events</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.emailNotifications ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order Notifications</p>
                      <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, orderNotifications: !notificationSettings.orderNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.orderNotifications ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.orderNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Inquiry Notifications</p>
                      <p className="text-sm text-gray-500">Receive alerts for new customer inquiries</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, inquiryNotifications: !notificationSettings.inquiryNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.inquiryNotifications ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.inquiryNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Newsletter Notifications</p>
                      <p className="text-sm text-gray-500">Send newsletters to subscribers</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, newsletterNotifications: !notificationSettings.newsletterNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.newsletterNotifications ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.newsletterNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Maintenance Mode</p>
                      <p className="text-sm text-gray-500">Put the site in maintenance mode</p>
                    </div>
                    <button
                      onClick={() => setNotificationSettings({...notificationSettings, maintenanceMode: !notificationSettings.maintenanceMode})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationSettings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notificationSettings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('notifications')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
                    </div>
                    <button
                      onClick={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.twoFactorAuth ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Strong Passwords</p>
                      <p className="text-sm text-gray-500">Require strong passwords for all users</p>
                    </div>
                    <button
                      onClick={() => setSecuritySettings({...securitySettings, requireStrongPassword: !securitySettings.requireStrongPassword})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        securitySettings.requireStrongPassword ? 'bg-green-600' : 'bg-gray-200'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        securitySettings.requireStrongPassword ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="120"
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="20"
                        value={securitySettings.passwordMinLength}
                        onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        min="3"
                        max="10"
                        value={securitySettings.loginAttempts}
                        onChange={(e) => setSecuritySettings({...securitySettings, loginAttempts: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('security')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Security Settings
                </button>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance Settings</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={appearanceSettings.primaryColor}
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                          className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={appearanceSettings.primaryColor}
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, primaryColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secondary Color
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={appearanceSettings.secondaryColor}
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, secondaryColor: e.target.value})}
                          className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={appearanceSettings.secondaryColor}
                          onChange={(e) => setAppearanceSettings({...appearanceSettings, secondaryColor: e.target.value})}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Logo URL
                      </label>
                      <input
                        type="text"
                        value={appearanceSettings.logoUrl}
                        onChange={(e) => setAppearanceSettings({...appearanceSettings, logoUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="/images/logo.png"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Favicon URL
                      </label>
                      <input
                        type="text"
                        value={appearanceSettings.faviconUrl}
                        onChange={(e) => setAppearanceSettings({...appearanceSettings, faviconUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        placeholder="/favicon.ico"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                        <p className="text-sm text-gray-500">Enable dark theme for the admin panel</p>
                      </div>
                      <button
                        onClick={() => setAppearanceSettings({...appearanceSettings, darkMode: !appearanceSettings.darkMode})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          appearanceSettings.darkMode ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          appearanceSettings.darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Compact Mode</p>
                        <p className="text-sm text-gray-500">Use compact layout for better screen utilization</p>
                      </div>
                      <button
                        onClick={() => setAppearanceSettings({...appearanceSettings, compactMode: !appearanceSettings.compactMode})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          appearanceSettings.compactMode ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          appearanceSettings.compactMode ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('appearance')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Appearance Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <Info className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-blue-800">Settings Information</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>• Settings are automatically saved to your browser's local storage.</p>
              <p>• Use the Export button to backup your settings.</p>
              <p>• Import settings to restore configuration on another device.</p>
              <p>• Some settings may require a page refresh to take effect.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
