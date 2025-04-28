import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import {
  useModalAction,
  useModalState,
} from '@/components/ui/modal/modal.context';
import TextArea from '@/components/ui/text-area';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { siteSettings } from '@/settings/site.settings';
import { useReplyQuestionMutation } from '@/data/question';
import Modal from '@/components/ui/modal/modal';

type FormValues = {
  answer: string;
  reply_question_answer: string;
};

interface LinkTerminalModalProps {
  open?: boolean;
  onClose?: () => void;
  data?: any;
}

const LinkTerminalModal = ({ open, onClose, data: propData }: LinkTerminalModalProps) => {
  const { t } = useTranslation();
  const { mutate: replyQuestion, isLoading: loading } =
    useReplyQuestionMutation();

  // Use context data if available, otherwise use props
  const contextData = useModalState();
  const contextClose = useModalAction().closeModal;
  
  const data = propData || contextData;
  const closeModal = onClose || contextClose;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      answer: data?.answer,
    },
  });

  function onSubmit({ answer }: FormValues) {
    replyQuestion({
      id: data?.id as string,
      answer,
    });
    closeModal();
  }

  const content = (
    <div className="m-auto w-full max-w-lg rounded bg-light sm:w-[32rem]">
      <div className="flex items-center border-b border-border-200 p-7">
        <div className="flex-shrink-0 rounded border border-border-100">
          <Image
            src={
              data?.product?.image?.thumbnail ??
              siteSettings.product.placeholder
            }
            alt={data?.product?.name}
            width={96}
            height={96}
            className="overflow-hidden rounded object-fill"
          />
        </div>

        <div className="ms-7">
          <h3 className="mb-2 text-sm font-semibold text-heading md:text-base">
            {data?.product?.name}
          </h3>
          <div className="text-sm text-body text-opacity-80">
            {t('common:text-product-id')}:{' '}
            <span className="font-semibold text-accent">
              {data?.product?.id}
            </span>
          </div>
        </div>
      </div>
      <div className="px-7 pt-6 pb-7">
        <div className="mb-4 text-sm font-semibold text-heading md:text-base">
          <span className="me-1 inline-block uppercase">Q:</span>
          {data?.question}
        </div>
        <form
          className="flex w-full flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextArea
            {...register('answer', {
              required: `${t('form:error-answer-required')}`,
            })}
            placeholder={t('form:input-answer-placeholder')}
            error={t(errors.answer?.message!)}
            className="mb-4"
          />
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="ms-auto"
          >
            {t('form:button-text-reply')}
          </Button>
        </form>
      </div>
    </div>
  );

  // If open prop is provided, use it as controlled modal
  if (typeof open !== 'undefined') {
    return (
      <Modal open={open} onClose={closeModal}>
        {content}
      </Modal>
    );
  }

  // Otherwise return just the content (will be used with modal context)
  return content;
};

export default LinkTerminalModal;