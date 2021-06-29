// import { useContext, useState } from 'react';
// import AuthContext from '../../context/auth/AuthContext';
// import Spinner from 'react-bootstrap/Spinner';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';

// const ForgetPasswordValid = () => {
//   const authContext = useContext(AuthContext);
//   const { getValidCode, isSendValidCode } = authContext;

//   // 驗證碼
//   const [validCode, setValidCode] = useState({
//     val: '',
//     isValid: true,
//     error: '',
//   });

//   // 密碼
//   const [newPassword, setNewPassword] = useState({
//     val: '',
//     isValid: true,
//     error: '',
//   });

//   const [confirmPassword, setConfirmPassword] = useState({
//     val: '',
//     isValid: true,
//     error: '',
//   });

//   // loading
//   const [isLoading, setLoading] = useState(false);

//   const handleChange = e => {
//     if (e.target.name === 'validCode') {
//       setValidCode({
//         val: e.target.value,
//         isValid: true,
//         error: '',
//       });
//     }

//     if (e.target.name === 'newPassword') {
//       setNewPassword({
//         val: e.target.value,
//         isValid: true,
//         error: '',
//       });
//     }

//     if (e.target.name === 'confirmPassword') {
//       setConfirmPassword({
//         val: e.target.value,
//         isValid: true,
//         error: '',
//       });
//     }
//   };

//   // send valid code
//   const sendValidCode = async () => {
//     // setLoading(true);
//     // const data = {
//     //   countryCode: countryCode.val,
//     //   phoneNumber: phoneNumber.val,
//     // };
//     // await getValidCode(data);
//     // setLoading(false);
//   };

//   //   const validPassword = () => {
//   //     //驗證密碼
//   //     if (
//   //       newPassword.val === '' ||
//   //       !validator.isAlphanumeric(newPassword.val) ||
//   //       newPassword.val.length < 6
//   //     ) {
//   //       setNewPassword({
//   //         val: '',
//   //         isValid: false,
//   //         error: '密碼只能是英文及數字，且至少六位數',
//   //       });
//   //     }

//   //     if (newPassword.val !== confirmPassword.val) {
//   //       setNewPassword({
//   //         val: confirmPassword.val,
//   //         isValid: false,
//   //         error: '兩次密碼不一致',
//   //       });
//   //     }
//   //   };

//   return (
//     <Card
//       body
//       className="mt_120 mx-auto p_sm"
//       style={{ borderRadius: '10px', overflow: 'hidden', maxWidth: '500px' }}
//     >
//       <Form>
//         <h1 className="mb-4 text-center">忘記密碼</h1>
//         <br />
//         <Form.Row className="mx-auto justify-content-between align-items-center">
//           <Form.Group as={Col} xl={8} className="">
//             <Form.Control
//               className="form-select "
//               type="number"
//               placeholder="輸入驗證碼"
//               autoComplete="off"
//               name="validCode"
//               value={validCode.val}
//               onChange={handleChange}
//             />
//           </Form.Group>
//           <Form.Group as={Col} className="" xl={4}>
//             <Button
//               onClick={sendValidCode}
//               aria-controls="example-collapse-text"
//               // aria-expanded={phoneValid}
//               className="w-100 easy-btn-bs"
//               disabled={isLoading}
//               style={{
//                 cursor: isLoading ? 'not-allowed' : 'pointer',
//                 backgroundColor: isLoading ? 'grey' : '#3e80f9',
//               }}
//             >
//               {isLoading && <Spinner className="mr-3" animation="grow" variant="danger" />}

//               {!isLoading ? <span>發送驗證碼</span> : <span>Loading...</span>}
//             </Button>
//           </Form.Group>
//           <Form.Text className="pl-2">*點擊按鈕後發送一次性驗證碼</Form.Text>
//         </Form.Row>
//       </Form>
//     </Card>
//   );
// };

// export default ForgetPasswordValid;
