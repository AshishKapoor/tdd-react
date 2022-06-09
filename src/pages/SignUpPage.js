import { t } from "i18next";
import React from "react";
import { withTranslation } from "react-i18next";
import { signUp } from "../api/apiCalls";
import Alert from "../components/Alert";
import ButtonWithProgress from "../components/ButtonWithProgress";
import Input from "../components/Input";

class SignUpPage extends React.Component {
  state = {
    email: "",
    username: "",
    password: "",
    passwordRepeat: "",
    apiProgress: false,
    signUpSuccess: false,
    errors: {},
  };

  onChange = (event) => {
    const { id, value } = event.target;
    const removeErrorsOnUserInput = { ...this.state.errors };
    delete removeErrorsOnUserInput[id];
    this.setState({
      [id]: value,
      errors: removeErrorsOnUserInput,
    });
  };

  submit = async (event) => {
    event.preventDefault();
    const { username, password, email } = this.state;
    const body = {
      username,
      email,
      password,
    };
    this.setState({ apiProgress: true });
    // fetch("/api/v1/users", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(body),
    // });
    try {
      await signUp(body);
      this.setState({ signUpSuccess: true });
    } catch (error) {
      if (error.response.status === 400) {
        this.setState({ errors: error.response.data.validationErrors });
      }
      this.setState({ apiProgress: false });
    }
  };

  render() {
    let disabled = true;
    const { password, passwordRepeat, apiProgress, signUpSuccess, errors } =
      this.state;
    if (password && passwordRepeat) {
      disabled = password !== passwordRepeat;
    }
    let passwordMismatch =
      password !== passwordRepeat ? t("passwordMismatchValidation") : "";
    return (
      <div
        className="col-lg-6 offset-lg-3 col-md-8 offset-md-2"
        data-testid="sign-up-page"
      >
        {!signUpSuccess && (
          <form className="card" data-testid="form-sign-up">
            <div className="card-header">
              <h1 className="text-center">{t("signUp")}</h1>
            </div>
            <div className="card-body">
              <Input
                id="username"
                label={t("userName")}
                onChange={this.onChange}
                help={errors.username}
              />
              <Input
                id="email"
                label={t("email")}
                onChange={this.onChange}
                help={errors.email}
              />
              <Input
                id="password"
                label={t("password")}
                onChange={this.onChange}
                help={errors.password}
                type="password"
              />
              <Input
                id="passwordRepeat"
                label={t("repeatPassword")}
                onChange={this.onChange}
                help={passwordMismatch}
                type="password"
              />

              <div className="text-center">
                <ButtonWithProgress
                  disabled={disabled}
                  apiProgress={apiProgress}
                  onClick={this.submit}
                >
                  {t("signUp")}
                </ButtonWithProgress>
              </div>
            </div>
          </form>
        )}
        {signUpSuccess && (
          <Alert type="success">
            Please check your e-mail to activate your account
          </Alert>
        )}
      </div>
    );
  }
}

export default withTranslation()(SignUpPage);
