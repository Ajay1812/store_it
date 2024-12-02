"use client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import Image from 'next/image';
import { Models } from "node-appwrite";
import { actionsDropdownItems } from "@/constants";
import Link from 'next/link';
import { constructDownloadUrl } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from '@/components/ui/button';

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModelOpen, setIsModelOpen] = useState(false)
  const [isDropDownOpen, setIsDropDownOpen] = useState(false)
  const [action, setAction] = useState<ActionType | null>(null)
  const [name, setName] = useState(file.name)
  const [isLoading, setIsLoading] = useState(false)

  const closeAllModels = () => {
    setIsModelOpen(false)
    setIsDropDownOpen(false)
    setAction(null)
    setName(file.name)
    // setEmail()
  }

  const handleAction = async () => {

  }

  const renderDialogContent = () => {
    if (!action) return null
    const { value, label } = action
    // console.log("RENAME:", value)
    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">{label}</DialogTitle>
          {value === 'rename' && <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />}
        </DialogHeader>
        {['rename', 'delete', 'share'].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModels} className="modal-cancel-button">Cancel</Button>
            <Button type="submit" onClick={handleAction} className="modal-submit-buttonq">
              <p className="captilize">{value}</p>
              {isLoading && (
                <Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="animate-spin" />
              )}
            </Button>
          </DialogFooter>
        )
        }
      </DialogContent >
    )
  }

  return (
    <Dialog open={isModelOpen} onOpenChange={setIsModelOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image src="/assets/icons/dots.svg" width={30} height={30} alt="dots" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-[200px] truncate">{file.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem key={actionItem.label} onClick={() => {
              setAction(actionItem)
              if (['rename', 'details', 'delete', 'share'].includes(actionItem.value)) {
                setIsModelOpen(true)
              }
            }}>
              {actionItem.value === 'download' ? (<Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className="flex items-center gap-2" >
                <Image src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                {actionItem.label}
              </Link>) : (
                <div className="flex items-center gap-2">
                  <Image src={actionItem.icon} alt={actionItem.label} width={30} height={30} />
                  {actionItem.label}
                </div>
              )
              }
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog >

  )
}

export default ActionDropdown
