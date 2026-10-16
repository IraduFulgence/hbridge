import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../stores/auth";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({title, showBack = false}: HeaderProps){
 
   
    const user = useAuthStore((state) => state.user);
    const clearSession = useAuthStore((state)=>state.clearSession);

    const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : '';
    const handleLogout = async () =>{
        await clearSession();
        router.replace('/(auth)/login');
    };
    const gotoProfile = () =>{
        router.push('/(app)/profile');
    };

     const {t} = useTranslation();

    return(
        <View style={styles.headerContainer}>
            {/* left side with logo and brand title */}
         {showBack ? (
            <TouchableOpacity 
            onPress={() => router.back()}
            hitSlop={{top:12, bottom:12, right:12,left:12}}
            style={styles.leftPannel}
            >
                <Ionicons name="arrow-back" size={24} color="#16A34A" />                
            </TouchableOpacity>
         ):(
            <View style={styles.brand}>
                <View style={styles.logoBox}>
                <Ionicons name="heart" size={16} color="#FFFFFF" />
                </View>
                <Text style={styles.brandName}>HBridge</Text>
            </View>
         )}
        {/* right side with notification and user avatar */}
        <View style={styles.rightSlot}>
            <TouchableOpacity style={styles.iconButton}
            hitSlop={{top:12, bottom:12,right:12,left:12}}
            >
                <Ionicons name="notifications-outline" size={20} color="#374151" />
                <View style={styles.badge} />
            </TouchableOpacity>
            <Menu>
                {/* menu trigger */}
                <MenuTrigger 
                customStyles={{TriggerTouchableComponent:TouchableOpacity}}
                >
                    {/* we use initials for avatar */}
                    <View style={styles.avatar}>
                        <Text style ={styles.avatarText}>{initials}</Text>
                    </View>

                </MenuTrigger>

                <MenuOptions 
                 customStyles={{optionsContainer:styles.menuContainer}}
                >
                    {/* user data */}

                    <MenuOption disabled>
                    <View style={styles.menuUserInfo}>
                        <Text style={styles.menuName} numberOfLines={1}>
                            {user?.firstName} {user?.lastName}
                        </Text>
                      <Text style={styles.menuRole} numberOfLines={1}>
                        {user?.role?.replace(/_/g, ' ').toLowerCase()}
                      </Text>
                   </View>
                    </MenuOption>
                      <View style={styles.menuDivider} />
                      <MenuOption onSelect={gotoProfile}>
              <View style={styles.menuRow}>
                <Ionicons name="person-outline" size={18} color="#374151" />
                <Text style={styles.menuRowText}>{t ('header.profile')}</Text>
              </View>
            </MenuOption>

            <MenuOption onSelect={handleLogout}>
              <View style={styles.menuRow}>
                <Ionicons name="log-out-outline" size={18} color="#DC2626" />
                <Text style={[styles.menuRowText, { color: '#DC2626' }]}>
                  {t('header.signOut')}
                </Text>
              </View>
            </MenuOption>

                </MenuOptions>


            </Menu>
        </View>

        </View>
    );

}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginTop:50
    },
    leftPannel:{
        width: 40,
        height: 40,
        justifyContent:'center',
    },
    brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16A34A',
    letterSpacing: -0.3,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#16A34A',
  },
  avatarText: {
    color: '#16A34A',
    fontWeight: '700',
    fontSize: 14,
  },
  menuContainer: {
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 0,
    marginTop: 8,
    width: 220,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  menuUserInfo: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  menuRole: {
    fontSize: 13,
    color: '#6B7280',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuRowText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
  },

});