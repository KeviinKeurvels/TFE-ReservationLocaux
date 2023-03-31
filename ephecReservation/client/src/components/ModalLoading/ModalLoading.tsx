import './ModalLoading.css';

type ModalLoadingProps = {
  isLoading: any;
}

const ModalLoading = ({ isLoading }: ModalLoadingProps) => {

  return (
        <div style={{ display: isLoading ? 'flex' : 'none' }} className='modal'>
          <div className='modal_content'>
            <div className='loader'></div>
            <div className='modal_text'>Chargement en cours...</div>
          </div>
        </div>
  );
};

export default ModalLoading;
