import React from 'react'
import { View, Text } from 'react-native'
import Select2 from "react-native-select-two"
const MySelect = ({setSurahError,onSurahChange3 ,data,ref}) => {
    return (

        <Select2
            isSelectSingle
            ref={ref}
            selectedItem={[3]}
            style={{
                borderRadius: 5, height: 40, width: 200, borderColor: '#7a42f4',

            }}
            colorTheme="#7a42f4"
            backgroundColor='red'
            // underlineColorAndroid:'red'
            popupTitle="Select Surah"
            title="Select Surah"
            data={data}
            cancelButtonText={'cancel'}
            selectButtonText={'Choose'}
            listEmptyTitle={'no data found'}

            searchPlaceHolderText={'please select one option'}
            onSelect={data => {
                setSurahError(false)
                onSurahChange3(data)

            }}
            onRemoveItem={data => {

            }}
        />

    )
}

export default MySelect
