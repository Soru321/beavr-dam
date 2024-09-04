import { Body, BodyProps, Head, Html, Preview } from '@react-email/components';

import TailwindComponent from './tailwind';

interface LayoutComponentProps {
  children: React.ReactNode;
  bodyProps: BodyProps;
  preview: string;
}

export default function LayoutComponent({
  children,
  bodyProps,
  preview,
}: LayoutComponentProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body {...bodyProps}>
        <TailwindComponent>{children}</TailwindComponent>
      </Body>
    </Html>
  );
}
