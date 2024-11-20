import Expenses from './Expenses'
import NotFoundPage from './NotFoundPage';
import {Routes, Route} from 'react-router-dom';
import Login from './Login';
import Header from './Header';
import Add from './Add';
import About from './About';
import Edit from './Edit';
import SignUp from './SignUp';
import Invite from './Invite';

function App() {
  return (
    <div>
      <Header />
      <Routes>
          <Route path='/' element={<Expenses />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Sign-Up' element={<SignUp />} />
          <Route path='/Sign-Up/:familyId/:isAdult' element={<SignUp />} />
          <Route path='/Add' element={<Add />} />
          <Route path='/Edit/:expenseId' element={<Edit />} />
          <Route path='/About' element={<About />} />
          <Route path='/Invite' element={<Invite />} />
          <Route path="*" element={<NotFoundPage />} /> 
      </Routes>

    </div>
  );
}

export default App;
