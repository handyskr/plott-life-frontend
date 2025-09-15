import { actions, isInputError } from 'astro:actions';
import { useState } from 'preact/hooks';
import type { InferFieldErrors } from '../../actions/types.ts';
import { Fieldset } from '@plott-life/ui/components/Fieldset.tsx';
import { navigate } from '../../navigator';
import { TermsAgreementModal } from "@components/auth";

interface Props {
  username?: string | null;
  successURL: string;
}

export const SignUpForm = (props: Props) => {
  // NOTE: 이메일전달 확인목적으로 이메일도 포함
  const [fieldErrors, setFieldErrors] = useState<
    InferFieldErrors<typeof actions.login>
  >({});
  const [isOpenTermsModal, setIsOpenTermsModal] = useState(false);

  const onSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const { error } = await actions.check(formData);
      if (error) {
        throw error;
      }

      setIsOpenTermsModal(true);
      // ;
    } catch (error: any) {
      console.log(error);

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
      className='flex flex-col w-full gap-8'
      method='POST'
      onSubmit={onSubmit}
    >
      <Fieldset label={'이메일'}>
        <input
          type="hidden"
          name="username"
          value={props.username ?? ""}
        />
        <input
          className="w-full input input-lg input-natual validator"
          defaultValue={props.username as string}
          disabled
        />
      </Fieldset>
      <Fieldset
        label={'여권상 이름'}
        error={(fieldErrors.lastName || fieldErrors.firstName) && '이름을 입력해주세요.'}
      >
        <div className={'flex flex-col gap-3'}>
          <input
            className={'w-full input input-lg input-natual validator'}
            name='lastName'
            placeholder='이름 입력 (예: 길동)'
            required
            onInvalid={() => setFieldErrors((it) => ({ ...it, lastName: [''] }))}
          />
          <input
            className={'w-full input input-lg input-natual validator'}
            name='firstName'
            placeholder='성 입력 (예: 홍)'
            required
            onInvalid={() => setFieldErrors((it) => ({ ...it, firstName: [''] }))}
          />
        </div>
      </Fieldset>
      <Fieldset label={'연락처'}>
        <div className={'flex flex-col gap-3'}>
          <select
            className={'w-full input input-lg input-natual validator'}
            name='phoneCode'
          >
            <option>+82 (South Korea)</option>
          </select>
          <input
            className={'w-full input input-lg input-natual validator'}
            name='phoneNumber'
            placeholder='전화번호'
            required
            onInvalid={() => setFieldErrors((it) => ({ ...it, phoneNumber: [''] }))}
          />
        </div>
      </Fieldset>
      <Fieldset
        label={'비밀번호'}
        error={fieldErrors.password && '비밀번호가 일치하지 않습니다.'}
      >
        <input
          type='password'
          className={'w-full input input-lg input-natual validator'}
          name='password'
          placeholder='영문, 숫자, 특수문자 조합 8-20자'
          required
          min={8}
          max={20}
          onInvalid={() => setFieldErrors((it) => ({ ...it, password: [''] }))}
        />
      </Fieldset>
      <Fieldset
        label={'비밀번호 확인'}
        error={fieldErrors.password && '비밀번호가 일치하지 않습니다.'}
      >
        <input
          type='password'
          className={'w-full input input-lg input-natual validator'}
          name='password'
          placeholder='영문, 숫자, 특수문자 조합 8-20자'
          required
          min={8}
          max={20}
          onInvalid={() => setFieldErrors((it) => ({ ...it, password: [''] }))}
        />
      </Fieldset>
      <TermsAgreementModal
        isOpen={isOpenTermsModal}
        onClose={() => setIsOpenTermsModal(false)}
        onSubmitClick={async () => {
          await navigate(props.successURL);
        }}
      />

      <button type='submit' className='block btn btn-lg btn-neutral mt-8'>
        다음
      </button>
    </form>
  );
};
