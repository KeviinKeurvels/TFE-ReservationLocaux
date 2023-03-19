import './ModalLoading.css';

type ModalLoadingProps = {
  isLoading: any;
}

const ModalLoading = ({ isLoading }: ModalLoadingProps) => {

  return (
        <div style={{ display: isLoading ? 'flex' : 'none' }} className='modal'>
          <div className='modal-content'>
            <div className='loader'></div>
            <div className='modal-text'>Chargement en cours...</div>
          </div>
        </div>
  );
};

export default ModalLoading;
