import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, Animated } from 'react-native';

export default function App() {
  const [result, setResult] = useState("0");
  const [history, setHistory] = useState([]);
  const [isScientific, setIsScientific] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [introVisible, setIntroVisible] = useState(true);
  const animations = useState({
    plus: new Animated.Value(0),
    minus: new Animated.Value(0),
    multiply: new Animated.Value(0),
    divide: new Animated.Value(0),
    fade: new Animated.Value(1),
  })[0];

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animations.plus, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animations.minus, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animations.multiply, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animations.divide, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(animations.fade, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => setIntroVisible(false));
  }, [animations]);

  const handlePress = (buttonValue) => {
    if (buttonValue === "C") {
      setResult("0");
    } else if (buttonValue === "←") {
      setResult((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (buttonValue === "=") {
      try {
        const newResult = eval(result).toString();
        setHistory([...history, result + " = " + newResult]);
        setResult(newResult);
      } catch (e) {
        setResult("Error");
      }
    } else if (buttonValue === "√") {
      setResult(Math.sqrt(parseFloat(result)).toString());
    } else if (buttonValue === "^") {
      setResult(result + "");
    } else if (buttonValue === "sin") {
      setResult(Math.sin(parseFloat(result)).toString());
    } else if (buttonValue === "cos") {
      setResult(Math.cos(parseFloat(result)).toString());
    } else if (buttonValue === "tan") {
      setResult(Math.tan(parseFloat(result)).toString());
    } else if (buttonValue === "Sci") {
      setIsScientific(!isScientific);
    } else if (buttonValue === "Hist") {
      setModalVisible(true);
    } else {
      setResult((prev) => (prev === "0" ? buttonValue : prev + buttonValue));
    }
  };

  const basicButtons = [
    'C', '←', '/', '*',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.'
  ];

  const scientificButtons = [
    'C', '←', '/', '*',
    '7', '8', '9', '-',
    '4', '5', '6', '+',
    '1', '2', '3', '=',
    '0', '.', '√', '^', 'sin', 'cos', 'tan'
  ];

  if (introVisible) {
    return (
      <Animated.View style={[styles.introContainer, { opacity: animations.fade }]}>
        <View style={styles.symbolContainer}>
          <Animated.Text style={[styles.symbol, { transform: [{ scale: animations.plus }] }]}>+</Animated.Text>
          <Animated.Text style={[styles.symbol, { transform: [{ scale: animations.minus }] }]}>-</Animated.Text>
          <Animated.Text style={[styles.symbol, { transform: [{ scale: animations.multiply }] }]}>×</Animated.Text>
          <Animated.Text style={[styles.symbol, { transform: [{ scale: animations.divide }] }]}>÷</Animated.Text>
        </View>
        <Text style={styles.introText}>Unleash the Power of Calculation</Text>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <ScrollView style={styles.history}>
            {history.map((item, index) => (
              <Text key={index} style={styles.historyText}>{item}</Text>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Text style={styles.result}>{result}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.buttonSpecial} onPress={() => handlePress("Sci")}>
          <Text style={styles.buttonText}>Sci</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSpecial} onPress={() => handlePress("Hist")}>
          <Text style={styles.buttonText}>Hist</Text>
        </TouchableOpacity>
        {(isScientific ? scientificButtons : basicButtons).map((button) => (
          <TouchableOpacity key={button} style={styles.button} onPress={() => handlePress(button)}>
            <Text style={styles.buttonText}>{button}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.footer}>Developed by Spatakal Tech</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  introContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  symbolContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  symbol: {
    fontSize: 48,
    color: '#0033A0',
    marginHorizontal: 10,
  },
  introText: {
    fontSize: 24,
    color: '#0033A0',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  history: {
    alignSelf: 'stretch',
    backgroundColor: '#F1F1F1',
    padding: 10,
    maxHeight: 400,
    marginBottom: 20,
  },
  historyText: {
    fontSize: 16,
    color: '#0033A0',
  },
  result: {
    fontSize: 48,
    color: '#0033A0',
    alignSelf: 'flex-end',
    margin: 20,
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '22%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#0033A0',
  },
  buttonSpecial: {
    width: '45%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#007ACC',
  },
  closeButton: {
    backgroundColor: '#0033A0',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  footer: {
    fontSize: 14,
    color: '#0033A0',
    marginTop: 2,
  },
});