import { withTranslation } from "react-i18next";

const LanguageSelector = (props) => {
  return (
    <>
      <img
        title="Hindi"
        alt="Indian flag"
        style={{ height: 16, width: 20 }}
        src="https://countryflagsapi.com/png/in"
        onClick={() => {
          props.i18n.changeLanguage("hi");
        }}
      />
      <img
        title="English"
        alt="Great Britain flag"
        style={{ marginLeft: 5, height: 16, width: 20 }}
        src="https://countryflagsapi.com/png/gb"
        onClick={() => {
          props.i18n.changeLanguage("en");
        }}
      />
    </>
  );
};

export default withTranslation()(LanguageSelector);
