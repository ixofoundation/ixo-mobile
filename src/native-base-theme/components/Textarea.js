import variable from "./../variables/platform";
import { ThemeColors } from '../../styles/Colors';

export default (variables = variable) => {
  const textAreaTheme = {
    ".underline": {
      borderBottomWidth: variables.borderWidth,
      marginTop: 5,
      borderColor: variables.inputBorderColor
    },
    ".bordered": {
      borderBottomWidth: 1,
      marginTop: 5,
      borderColor: ThemeColors.blue_lightest
    },
    color: ThemeColors.white,
    paddingLeft: 10,
    paddingRight: 5,
    fontSize: 15,
    textAlignVertical: "top",
  };

  return textAreaTheme;
};
