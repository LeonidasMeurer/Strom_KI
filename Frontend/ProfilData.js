import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector } from 'react-redux'

const imageProfil = require("./images/profil.jpg")



const Profil = ({placeName}) => {
    let email = useSelector((state) => state.auth.email)


  return (
    <View style={styles.container}>
      {/* Profilavatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={imageProfil}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      {/* E-Mail */}
      <Text style={styles.email}>{email}</Text>

      {/* Ort */}
      <Text style={styles.place}>{placeName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#C3EFBA',
        margin: 10,
        padding:10
      },
      avatarContainer: {
        width: 130,
        height: 130,
        borderRadius: 65,
        overflow: 'hidden',
        marginBottom: 20,
      },
      avatar: {
        width: '100%',
        height: '120%',
      },
      email: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      place: {
        fontSize: 16,
        color: 'black',
      },
  

});

export default Profil;




