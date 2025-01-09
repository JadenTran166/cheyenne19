import swal from 'sweetalert2';

export const AlertModal = (messageTrigger) => {
  let timerInterval;
  swal
    .fire({
      icon: messageTrigger.icon,
      title: messageTrigger.title,
      html: messageTrigger.description,
      timer: messageTrigger.timer,
      timerProgressBar: true,
      showConfirmButton: false,
      willOpen: () => {
        //    swal.showLoading();
        timerInterval = setInterval(() => {
          const content = swal.getContent();
          if (content) {
            const b = content.querySelector('b');
            if (b) {
              b.textContent = swal.getTimerLeft();
            }
          }
        }, 100);
      },

      willClose: () => {
        clearInterval(timerInterval);
      },
    })
    .then((res) => {
      if (res.dismiss === swal.DismissReason.timer) {
      }
    });
};

export const ConfirmDialog = (messageTrigger) => {
  swal
    .fire({
      title: messageTrigger.title,
      text: messageTrigger.text,
      icon: messageTrigger.icon,
      showCancelButton: true,
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#3085d6',
      reverseButtons: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Đồng ý !',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancle-btn',
      },
    })
    .then(
      (result) => {
        if (result.isConfirmed) {
          if (typeof messageTrigger.preConfirm === 'function') {
            messageTrigger.preConfirm();
            return;
          }

          if (typeof messageTrigger.preConfirm === 'object') {
            // edit infor
            if (messageTrigger.where === 'item_deliver') {
              messageTrigger.preConfirm.handleDeleteSpecificDeliverInfor(
                messageTrigger.preConfirm.id
              );
              return;
            }
            // cart
            const { handleSendPay, sendContent, handleSendDelete, id } =
              messageTrigger.preConfirm;

            if (handleSendDelete) {
              messageTrigger.preConfirm.handleSendDelete(id);
            }

            if (handleSendPay) {
              handleSendPay(sendContent);
            }

            return;
          }
        }
      },
      (dissmiss) => {
        if (dissmiss === 'cancel') {
          messageTrigger.didClose();
          return;
        }
      }
    );
};
