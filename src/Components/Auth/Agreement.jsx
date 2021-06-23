import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useI18n } from '../../lang/index';

// Style
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Agreement = () => {
  const { t, setLocale } = useI18n();

  const history = useHistory();
  const [agree, setAgree] = useState(false);

  const handleCheck = e => {
    if (e.target.checked) {
      setAgree(true);
    } else {
      setAgree(false);
    }
  };

  const handleClick = () => {
    history.push('/auth/register');
  };
  return (
    <Container>
      <button onClick={() => setLocale('zh-HK')}>繁體</button>
      <button onClick={() => setLocale('zh-CN')}>簡體</button>
      <Card style={{ marginTop: '3rem', borderRadius: '5px', padding: 10 }}>
        <Card.Body>
          <h2 className="text-center" dangerouslySetInnerHTML={{ __html: t('agreement_title') }} />

          <h4 dangerouslySetInnerHTML={{ __html: t('agreement_rule') }} />
          <ul>
            {t('agreement_rule_list').map(el => (
              <li>{el}</li>
            ))}
          </ul>
          <h4>{t('agreement_buy_rule')}</h4>
          <p>{t('agreement_buy_rule_sub')}</p>
          <ul>
            {t('agreement_buy_rule_list').map(el => (
              <li>{el}</li>
            ))}
          </ul>
          <h4>{t('agreement_sell_rule')}</h4>
          <p>{t('agreement_sell_rule_sub')}</p>
          <ul>
            {t('agreement_sell_rule_list').map(el => (
              <li>{el}</li>
            ))}
          </ul>
          <h4>{t('user_rule')}</h4>
          <ul>
            {t('user_rule_list').map(el => (
              <li>{el}</li>
            ))}
          </ul>
          {/* 賣方 Table#1 */}
          <Table striped bordered responsive="sm">
            <>
              <thead>
                <tr>
                  {t('table_1_th').map(el => (
                    <th>{el}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {t('table_1_td_1').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>
                <tr>
                  {t('table_1_td_2').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>
                <tr>
                  {t('table_1_td_3').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>
                <tr>
                  {t('table_1_td_4').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>
                <tr>
                  {t('table_1_td_5').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>

                <tr>
                  {t('table_1_td_6').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>
                <tr>
                  {t('table_1_td_7').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>

                <tr>
                  {t('table_1_td_8').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>

                <tr>
                  {t('table_1_td_9').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>

                <tr>
                  {t('table_1_td_10').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>

                <tr>
                  {t('table_1_td_11').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>

                <tr>
                  {t('table_1_td_12').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>

                <tr>
                  {t('table_1_td_13').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>

                <tr>
                  {t('table_1_td_14').map(el => (
                    <td>{el}</td>
                  ))}
                </tr>
              </tbody>
            </>
          </Table>
          {t('table_1_ps').map(el => (
            <p>{el}</p>
          ))}
          <hr style={{ margin: '80px auto' }} width="40%" color="blue" size={3} />
          {/* 買方 */}
          <Table striped bordered responsive="sm">
            <thead>
              <tr>
                {t('table_2_th').map(el => (
                  <th>{el}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {t('table_2_td_1').map(el => (
                  <td>{el}</td>
                ))}
              </tr>
              <tr>
                {t('table_2_td_2').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_2_td_3').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_2_td_4').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_2_td_5').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_2_td_6').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_2_td_7').map(el => (
                  <td>{el}</td>
                ))}
              </tr>
            </tbody>
          </Table>
          <p>{t('table_2_ps')}</p>

          <hr style={{ margin: '80px auto' }} width="40%" color="blue" size={3} />
          {/* 風控 */}
          <Table striped bordered responsive="sm">
            <thead>
              <tr>
                {t('table_3_th').map(el => (
                  <th>{el}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {t('table_3_td_1').map(el => (
                  <td>{el}</td>
                ))}
              </tr>
              <tr>
                {t('table_3_td_2').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_3_td_3').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_3_td_4').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_3_td_5').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_3_td_6').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_3_td_7').map(el => (
                  <td>{el}</td>
                ))}
              </tr>

              <tr>
                {t('table_3_td_8').map(el => (
                  <td>{el}</td>
                ))}
              </tr>
            </tbody>
          </Table>
          <Form.Check
            style={{
              padding: 10,
              marginTop: 30,
              textAlign: 'center',
            }}
          >
            <Form.Group className="" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label={`${t('understand_agreement')}`} onChange={handleCheck} />
            </Form.Group>

            <Button disabled={!agree} style={{ width: 260, fontSize: 17, padding: 10 }} variant={!agree ? 'secondary' : 'primary'} onClick={handleClick}>
              {t('btn_confirm')}
            </Button>
          </Form.Check>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Agreement;
