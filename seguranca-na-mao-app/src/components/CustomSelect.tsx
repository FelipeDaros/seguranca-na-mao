import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

type PropsDropDown = {
  id: string | number;
  nome: string;
}

type Props = {
  data: PropsDropDown[];
  isDisabled: boolean;
  selectValue: (value: string | number | null) => void;
  value: string | number;
}

const DropdownComponent = ({ data, isDisabled = false, selectValue, value }: Props) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View className='w-full'>
      <Dropdown
        disable={isDisabled}
        style={isDisabled ? styles.dropdownIsDisabled : [styles.dropdown, isFocus && { borderColor: '#00B37E' }]}
        containerStyle={{ backgroundColor: '#121214', borderWidth: 0 }}
        itemTextStyle={{ color: '#fff' }}
        selectedTextStyle={{ width: 0, color: '#fff' }}
        placeholderStyle={{ color: '#fff' }}
        data={data}
        maxHeight={300}
        labelField="nome"
        valueField="id"
        placeholder="Selecione"
        // @ts-ignore
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          // @ts-ignore
          setIsFocus(false);
          selectValue(item.id)
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#121214'
  },
  dropdownIsDisabled: {
    height: 50,
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#2929298e'
  }
});