import { actions, isInputError } from 'astro:actions';
import { useState } from 'preact/hooks';
import type { InferFieldErrors } from '../../actions/types.ts';
import { Fieldset } from '@plott-life/ui/components/Fieldset.tsx';
import { navigate } from '../../navigator';

interface Props {
  username?: string | null;
  successURL: string;
}

export const VerifyEmailForm = (props: Props) => {
  // NOTE: 이메일전달 확인목적으로 이메일도 포함
  const [fieldErrors, setFieldErrors] = useState<
    InferFieldErrors<typeof actions.login>
  >({});

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    setFieldErrors({});

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const { error } = await actions.check(formData);
      if (error) {
        throw error;
      }

      await navigate(props.successURL);
    } catch (error: any) {
      if (isInputError(error)) {
        setFieldErrors(error.fields);
        return;
      }

      switch (error?.code) {
        case 'NOT_FOUND':
          alert('가입되지 않은 이메일입니다.');
          break;
        default:
          alert('알 수 없는 에러가 발생했습니다.');
          console.error(error);
          break;
      }
    }
  };

  return (
    <form
      className='flex flex-col w-full gap-6'
      method='POST'
      onSubmit={onSubmit}
    >
      {/* MEMO: 이메일 주소 필요한 경우 사용 */}
      {/*<Fieldset*/}
      {/*  hidden={!!props.username}*/}
      {/*  label={'이메일'}*/}
      {/*  error={fieldErrors.username && '올바른 이메일을 입력해 주세요.'}*/}
      {/*>*/}
      {/*  <input*/}
      {/*    type='email'*/}
      {/*    className={'w-full input input-lg input-neutral validator'}*/}
      {/*    name='username'*/}
      {/*    placeholder='이메일 주소 입력'*/}
      {/*    required*/}
      {/*    defaultValue={props.username as string}*/}
      {/*    onInvalid={() => setFieldErrors((it) => ({ ...it, username: [''] }))}*/}
      {/*  />*/}
      {/*</Fieldset>*/}
      <Fieldset
        error={fieldErrors.code && '코드를 입력해주세요.'}
      >
        <input
          className={'w-full input input-lg input-neutral validator'}
          name='code'
          placeholder='코드 입력'
          required
          defaultValue={props.username as string}
          onInvalid={() => setFieldErrors((it) => ({ ...it, username: [''] }))}
        />
      </Fieldset>
      <button type='submit' className='block btn btn-lg btn-neutral'>
        확인
      </button>
      <div className={'flex flex-row items-center gap-2'}>
        <p className='body3 text-gray-600'>
          메일을 받지 못하셨나요?
        </p>
        <button
          type='submit'
          className='body3 text-gray-900 underline cursor-pointer'
        >
          재전송
        </button>
      </div>
    </form>
  );
};
