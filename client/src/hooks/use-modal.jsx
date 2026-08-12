import { useState } from 'react'
export const useModal = () => {
  const [show, setShow] = useState(false);

  const openModal = () => setShow(true);
  const closeModal = () => setShow(false);

  const onHide = () => {
    closeModal();
  };

  return { show, onHide, openModal, closeModal };
}