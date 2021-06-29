import React, { Component, Fragment } from 'react';
import Countdown from 'react-countdown';

// Components
import SuccessRegister from '../successRegister';
import ButtonTimer from './ButtonTimer';
import Spinner from '../../../Ui/BaseSpinner';

// Style
import { Form, Button, Col, InputGroup } from 'react-bootstrap';
import './index.scss';

export default class ValidCode extends Component {
  state = {
    validNum: {
      val: '',
    },
    formIsValid: false,
    error: '',
    resendValidCode: false,
    isLoading: false,
    isRegister: false,
    inputValid: false,
    alreadyRegister: false,
  };

  // const [validNum, setValidNum] = useState('')
  // const [formIsValid, setFormIsValid] = useState(false)
  // const [error, setError] = useState('')
  // const [resendValidCode, setResendValidCode] = useState(false)
  // const [isLoading, setIsLoading] = useState(false)
  // const [isRegister, setIsRegister] = useState(false)
  // const [inputValid, setInputValid] = useState(false)

  // 驗證碼如果是六位數的話
  setValidNum = event => {
    if (event.target.value.length === 6) {
      this.setState(
        {
          validNum: {
            val: event.target.value.trim(),
          },
          error: '',
          inputValid: true,
        },
        () => {
          this.handleSubmit();
        }
      );
    } else {
      this.setState({
        validNum: {
          val: event.target.value.trim(),
        },
        formIsValid: false,
        error: '',
        inputValid: true,
      });
    }
  };

  componentWillUnmount() {
    localStorage.removeItem('expiresIn');
  }

  componentDidMount() {}

  handleHttpError = data => {
    if (data.code === '1') {
      alert('系統錯誤');
      return;
    }

    if (data.code === '10') {
      alert('帳號或密碼錯誤');
      return;
    }

    if (data.code === '11') {
      alert('此帳號已經註冊過');
      return;
    }

    if (data.code === '12') {
      alert('此帳號無法註冊，可能被列入黑名單');
      return;
    }

    if (data.code === '13') {
      alert('json格式錯誤');
      return;
    }
    if (data.code === '14') {
      alert('json格式錯誤');
      return;
    }

    if (data.code === '15') {
      alert('無效的token');
      return;
    }

    if (data.code === '16') {
      alert('錯誤的操作');
      return;
    }

    if (data.code === '17') {
      alert('帳號未註冊');
      return;
    }

    if (data.code === '20') {
      alert('數據格式錯誤');
      return;
    }

    if (data.code === '21') {
      alert('請勿連續發送請求');
      return;
    }

    // if (data.code === '22') {
    //   alert('無效的一次性驗證碼');
    //   return;
    // }

    if (data.code === '30') {
      alert('無效的錢包地址');
      return;
    }

    if (data.code === '31') {
      alert('不能轉帳給自己');
      return;
    }

    if (data.code === 'ˇ32') {
      alert('可提不足');
      return;
    }

    if (data.code === 'ˇ91') {
      alert('session過期，請重新登入');
      return;
    }
  };

  // 請求發送驗證碼
  getValidCode = async () => {
    this.setState({
      resendValidCode: true,
      isLoading: true,
    });

    const expiresStamp = 120000;
    const expiresDate = Date.now() + expiresStamp;

    localStorage.setItem('expiresIn', expiresDate);

    let { phoneNumber, countryCode } = this.props;
    const registerApi = `/j/Req_oneTimePwd.aspx`;
    if (countryCode === 886) {
      // 如果第一個字是0，就刪除掉
      if (phoneNumber.charAt(0) === '0') {
        phoneNumber = phoneNumber.substr(1);
      }
    }
    try {
      const res = await fetch(registerApi, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: countryCode,
          reg_tel: phoneNumber,
        }),
      });
      const resData = await res.json();

      this.setState({
        isLoading: false,
      });

      this.handleHttpError(resData);
    } catch (error) {
      this.setState({
        isLoading: false,
      });
      alert(error);
    }
  };

  // 驗證碼確認是否ＯＫ
  handleSubmit = async () => {
    // event.preventDefault(); //防止表單提交

    const { validNum } = this.state;
    let { phoneNumber, countryCode } = this.props;

    if (countryCode === 886) {
      // 如果第一個字是0，就刪除掉
      if (phoneNumber.charAt(0) === '0') {
        phoneNumber = phoneNumber.substr(1);
      }
      // phoneNumber = phoneNumber.substr(1);
    }

    const timePwdApi = `/j/ChkoneTimePwd.aspx`;

    try {
      const res = await fetch(timePwdApi, {
        method: 'POST',
        body: JSON.stringify({
          reg_countrycode: countryCode,
          reg_tel: phoneNumber,
          OneTimePwd: validNum.val,
        }),
      });

      const resData = await res.json();

      this.setState({
        isLoading: false,
      });

      if (resData.code === 200) {
        const token = resData.data;

        this.setState({
          validNum: {
            val: validNum.val,
          },
          error: '',
          token,
          formIsValid: true,
        });

        // this.registerClient(token, countryCode, phoneNumber, password);
      } else {
        this.setState({
          validNum: {
            val: '',
          },
          error: '*驗證碼錯誤',
        });
      }

      this.handleHttpError(resData);
    } catch (error) {
      alert(error);
      this.setState({
        isLoading: false,
        error: error,
      });
    }
  };

  // 註冊最後一步
  registerClient = async (token, countryCode, phoneNumber, password) => {
    this.setState({
      isLoading: true,
    });

    if (countryCode === 886) {
      // 如果第一個字是0，就刪除掉
      if (phoneNumber.charAt(0) === '0') {
        phoneNumber = phoneNumber.substr(1);
      }
    }

    const registerClientApi = `/j/req_RegClient.aspx`;

    const res = await fetch(registerClientApi, {
      method: 'POST',
      body: JSON.stringify({
        reg_countrycode: countryCode,
        reg_tel: phoneNumber,
        reg_pwd: password,
        reg_token: token,
      }),
    });

    const resData = await res.json();

    // 已經註冊過了
    if (resData.code === '11') {
      this.setState({
        isRegister: true,
        alreadyRegister: true,
        isLoading: false,
      });
      return;
    }

    if (resData.code !== 200) {
      this.setState({
        isLoading: false,
      });
      this.handleHttpError(resData);

      // this.setState({
      //   isLoading: false,
      //   error: resData.msg,
      // });
      return;
    }

    if (resData.code === 200) {
      this.setState({
        isLoading: false,
        isRegister: true,
      });
    }
  };

  render() {
    const { validNum, error, resendValidCode, isLoading, isRegister, token, formIsValid, inputValid, alreadyRegister } = this.state;
    let { phoneNumber, countryCode, password } = this.props;

    let timer;

    timer = localStorage.getItem('expiresIn') - Date.now();

    return (
      <Fragment>
        {isLoading ? (
          <div className="mt-4">
            <Spinner />
          </div>
        ) : isRegister && !isLoading ? (
          <SuccessRegister />
        ) : (
          <Form className="mx-auto">
            <Form.Row className="align-items-center">
              <Form.Group as={Col} sm={12} controlId="formBasicValidCode" className="">
                <Form.Label className="mb-4 fs_15">點擊按鈕後發送驗證碼</Form.Label>
                <InputGroup className="mb-2 mr-sm-2">
                  <InputGroup.Prepend>
                    <InputGroup.Text>VEK&nbsp;-</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control placeholder="一次性驗證碼" className="form-input mb-0" onChange={this.setValidNum} value={validNum.val} autoComplete="off" type="number" isValid={formIsValid} />
                </InputGroup>

                {error ? <Form.Text className="text-muted">{error}</Form.Text> : null}
              </Form.Group>

              <Form.Group as={Col}>
                <Countdown
                  date={timer <= 0 && !inputValid ? Date.now() + 120000 : Date.now() + timer}
                  renderer={props => <ButtonTimer resendValidCode={resendValidCode} getValidCode={this.getValidCode} {...props} />}
                  className="mt-4"
                ></Countdown>
              </Form.Group>
            </Form.Row>

            <Form.Row className="">
              <Form.Group as={Col}>
                <Button
                  onClick={() => this.registerClient(token, countryCode, phoneNumber, password)}
                  // variant="primary"
                  variant={!formIsValid ? 'secondary' : 'primary'}
                  type="submit"
                  size="lg"
                  block
                  className="fs_20"
                  disabled={!formIsValid}
                >
                  確定
                </Button>
              </Form.Group>
            </Form.Row>
          </Form>
        )}
      </Fragment>
    );
  }
}
