import { type ActionError, actions, isInputError } from 'astro:actions';
import { Fieldset } from '@plott-life/ui/components/Fieldset.tsx';
import { navigateWithQuery } from '../../../navigator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyCodeInput } from '../../../actions/schema.ts';
import { handleSetActionInputError } from '../../../actions/utils.ts';
import type { ActionSubmitHandler } from '../../../actions/types.ts';
import { toast } from '@libs/toast.ts';

interface Props {
  email?: string | null;
  successURL: string;
}

export const VerifyEmailForm = (props: Props) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyCodeInput),
  });
  const setActionError = handleSetActionInputError(setError);

  const onSubmit: ActionSubmitHandler<typeof actions.verifyCode> = async (
    data,
  ) => {
    try {
      const { error } = await actions.verifyCode(data);
      if (error) {
        throw error;
      }

      await navigateWithQuery(props.successURL, {});
    } catch (error: any) {
      if (isInputError(error)) {
        setActionError(error);
        return;
      }

      switch ((error as ActionError)?.code) {
        default:
          toast.show({ type: 'default', message: error?.message || '알 수 없는 에러가 발생했습니다.' });
          console.error(error);
          break;
      }
    }
  };

  const onResend = async () => {
    const { error } = await actions.requestCode({});
    if (error) {
      toast.show({ type: 'default', message: '코드 재전송에 실패했습니다. 잠시 후 다시 시도해주세요.' });
      return;
    }

    toast.show({ type: 'default', message: '코드가 재전송되었습니다.' });
  };

  return (
    <form
      className='flex flex-col w-full gap-6'
      method='POST'
      onSubmit={handleSubmit(onSubmit)}
    >
      <Fieldset error={errors.code && '코드를 입력해주세요.'}>
        <input
          {...register('code')}
          className={'w-full input input-lg input-neutral validator'}
          placeholder='코드 입력'
        />
      </Fieldset>
      <button type='submit' className='block btn btn-lg btn-neutral'>
        확인
      </button>
      <div className={'flex flex-row items-center gap-2'}>
        <p className='body3 text-gray-600'>메일을 받지 못하셨나요?</p>
        <button
          type='button'
          className='body3 text-gray-900 underline cursor-pointer'
          onClick={onResend}
        >
          재전송
        </button>
      </div>
    </form>
  );
};
