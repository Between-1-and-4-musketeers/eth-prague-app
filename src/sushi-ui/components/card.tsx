import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'
import { ReactNode } from 'react'

import classNames from 'classnames'
import { SkeletonText } from './skeleton'

const cardVariants = cva('relative rounded-xl border border-accent', {
  variants: {
    variant: {
      default: 'shadow-sm bg-white dark:bg-background',
      outline: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface CardProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cardVariants({ variant, className })}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

interface CardOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  show: boolean
}

const CardOverlay = React.forwardRef<HTMLDivElement, CardOverlayProps>(
  ({ show, className, ...props }, ref) => (
    <div
      data-state={show ? 'active' : 'inactive'}
      ref={ref}
      className={classNames(
        'data-[state=active]:flex data-[state=inactive]:hidden rounded-xl z-10 bg-white/[0.8] dark:bg-slate-900/[0.8] pointer-events-none absolute inset-0 justify-center items-center',
        className,
      )}
      {...props}
    />
  ),
)
CardOverlay.displayName = 'CardOverlay'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames(
      'flex flex-col space-y-1.5 p-6 whitespace-pre-wrap',
      className,
    )}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={classNames(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames('flex flex-col gap-3', className)}
    {...props}
  />
))
CardGroup.displayName = 'CardGroup'

const CardLabel = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={classNames(
      'font-normal text-xs text-gray-400 dark:text-slate-600',
      className,
    )}
    {...props}
  />
))
CardLabel.displayName = 'CardLabel'

type CardItemProps =
  | (Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> & {
      title: ReactNode
      subtitle?: string
      children?: ReactNode
      skeleton?: never
      flex?: boolean
      className?: string
    })
  | {
      title?: never
      subtitle?: boolean
      children?: never
      skeleton?: boolean
      flex?: boolean
      className?: string
    }

const CardItem = React.forwardRef<HTMLDivElement, CardItemProps>(
  ({ skeleton, flex, subtitle, title, children, className, ...props }, ref) => {
    if (skeleton) {
      return (
        <div ref={ref} className="grid grid-cols-2 gap-2" {...props}>
          <div className="flex flex-col gap-0.5">
            <SkeletonText fontSize="sm" />
            {subtitle && <SkeletonText fontSize="xs" />}
          </div>
          <div className="flex justify-end">
            <SkeletonText fontSize="sm" />
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={classNames(
          className,
          flex ? 'flex justify-between items-center' : 'grid grid-cols-2',
          'gap-2',
        )}
        {...props}
      >
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
            {title}
          </span>
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
        <div className="flex justify-end">
          <span className="flex justify-end w-full text-sm font-medium text-right text-gray-900 truncate dark:text-slate-50">
            {children}
          </span>
        </div>
      </div>
    )
  },
)
CardItem.displayName = 'CardItem'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames('p-6 pt-0 flex flex-col gap-6', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={classNames(' flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardGroup,
  CardHeader,
  CardItem,
  CardLabel,
  CardOverlay,
  CardTitle,
}
