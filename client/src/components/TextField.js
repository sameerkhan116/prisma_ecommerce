import React from 'react';
import { TextInput } from 'react-native';

const field = {
  fontSize: 15,
  marginBottom: 15,
  height: 35,
};

const TextField = ({
  name, secureTextEntry, value, onChangeText,
}) => {
  const change = (text) => {
    onChangeText(name, text);
  };

  return (
    <TextInput
      value={value}
      style={field}
      placeholder={name}
      onChangeText={change}
      autoCapitalize="none"
      secureTextEntry={!!secureTextEntry}
    />
  );
};

export default TextField;
