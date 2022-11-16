import { useMutation } from "@apollo/client";
import ConfirmDeleteModal from "components/ConfirmDeleteModal";
import ModalPortal from "components/ModalPortal";
import { GetMonitors } from "graphql/queries";
import { DeleteOneMonitor} from "graphql/mutations";
import { useToast } from "hooks/ToastProvider";
import { useModal } from "hooks/useModal";
import { useEffect } from "react";
import { Button, Table, Tooltip } from "react-daisyui";
import { FaSpinner } from "react-icons/fa";
import { MdDelete, MdEdit, MdHistory } from "react-icons/md";
import { Link } from "react-router-dom";
import {ICollection, Monitor, MonitorContactInfo} from 'types'

interface Props {
  schedule: string;
  collections: ICollection[];
  contactInfo: MonitorContactInfo;
  id: number;
}

const ICON_SIZE = 24

export default function MonitorListItem({ schedule, collections, contactInfo, id }: Props) {
  const [deleteModalOpen, toggleDeleteModalOpen] = useModal();
  const { addToast } = useToast();
  const [deleteMonitor, { loading: deleting, error: deleteError }] = useMutation(DeleteOneMonitor, {
    update(cache, { data: { deleteOneMonitor } }) {
      const monitorQuery = cache.readQuery<{ monitors: Monitor[] }>({ query: GetMonitors });
      if (!monitorQuery) return;
      cache.writeQuery({
        query: GetMonitors,
        data: { monitors: monitorQuery.monitors.filter(monitor => monitor.id !== deleteOneMonitor.id) }
      });
    }
  });

  const handleDelete = () => {
    toggleDeleteModalOpen();
    return deleteMonitor({ variables: { where: { id } } });
  };

  useEffect(() => {
    if (deleteError) addToast(deleteError.message, "error");
  }, [deleteError, addToast]);

  return (
    <>
      <Table.Row>
        <span>Running every {schedule}</span>
        <span className='capitalize'>{Object.keys(contactInfo || {}).join(', ') || "No contact info"}</span>
        <span className="flex gap-2">
          {collections.map(collection => (
            <span key={collection.id}>{collection.title}</span>
          ))}
        </span>
        <div className="flex gap-2 items-center">
          <Tooltip message="View History">
            <Link className="btn btn-ghost" to={`/monitors/${id}`}>
              <MdHistory size={ICON_SIZE} className="text-accent" />
            </Link>
          </Tooltip>
          <Link className='btn btn-ghost' to={`/monitors/${id}/edit`}>
            <MdEdit size={ICON_SIZE} className="text-sky-blue" />
          </Link>
          <Button startIcon={<MdDelete size={ICON_SIZE} className="text-error" />} color="ghost" size="md"
                  onClick={toggleDeleteModalOpen}
          >{deleting && <FaSpinner className="animate-spin" />}</Button>
        </div>
        {id ? (
          <div>
          </div>
        ) : <></>}
      </Table.Row>
      <ModalPortal id="confirm-delete-modal">
        <ConfirmDeleteModal message="This action cannot be undone" open={deleteModalOpen} onDelete={handleDelete}
                            onCancel={toggleDeleteModalOpen} />
      </ModalPortal>
    </>
  );
}