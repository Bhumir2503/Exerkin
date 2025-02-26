import { Modal, Text, View, Platform, StyleSheet, StatusBar } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";


const WorkoutModal = ({ visible, title, children }) => {
    const { themeStyle, theme } = useTheme();
    const styles = createStyles(themeStyle);
    return (
        <Modal
            presentationStyle="pageSheet"
            animationType="slide"
            visible={visible}
            statusBarTranslucent={Platform.OS === "android" ? true : false} 
        >
            <SafeAreaView style={styles.modal}>
                {visible ? <StatusBar barStyle={'light-content'} /> : null}
                {children}
            </SafeAreaView>
        </Modal>
    )
}

const createStyles = (theme) => {
    return StyleSheet.create({
        modal: {
            flex: 1,
            backgroundColor: theme.card,
        },
    })
}

export default WorkoutModal;