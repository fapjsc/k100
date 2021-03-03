import './App.css';
import LoginForm from './Components/Auth/Login';
import BaseCard from './Components/Ui/BaseCard';

function App() {
  return (
    <div className="App">
      <BaseCard>
        <LoginForm />
      </BaseCard>
    </div>
  );
}

export default App;
