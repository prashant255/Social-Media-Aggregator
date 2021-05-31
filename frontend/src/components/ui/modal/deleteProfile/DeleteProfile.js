import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import cssClasses from './DeleteProfile.module.css';
import axios from '../../../../axios/lurkerBackend';
import { useSelector } from 'react-redux'
import Logout from '../../../logout/Logout';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    height: 250,
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 12, 3),
  }

}));

const DeleteProfileModal = (props) =>{
  const classes = useStyles();
  const jwtToken = useSelector(state => state.jwtToken)
  const [accountDeleted, setAccountDeleted] = React.useState(false);

  const deleteAccount = () => {
    axios.post('/settings/deleteAccount', {}, {
        headers: {
            'Authorization': `Bearer ${jwtToken}`
        }
    }).then(() => {
        setAccountDeleted(true)      
    })
  }

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={() => props.handleModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className={classes.paper}>
              <h1>Delete Account</h1>
              <p>Are you sure you want to delete your account? <br />This process cannot be undone.</p>
              <div>
                <button type="button" onClick= {() => props.handleModal(false)} className={cssClasses.button + ' ' + cssClasses.cancelbtn}>Cancel</button>
                <button type="button" onClick={deleteAccount} className={cssClasses.button + ' ' + cssClasses.deletebtn}>Delete</button>
              </div>
          </div>
        </Fade>
      </Modal>
      {accountDeleted ? <Logout /> : null}
    </div>
  );
}

export default DeleteProfileModal
