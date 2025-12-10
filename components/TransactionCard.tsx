import React from 'react';
import { Transaction, TransactionFinding } from '../types';
import RiskBadge from './RiskBadge';

interface TransactionCardProps {
  transaction: Transaction;
  finding?: TransactionFinding;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, finding }) => {
  const isOutflow = transaction.direction === 'outflow';
  const amountColor = isOutflow ? 'text-red-600' : 'text-green-600';
  const amountPrefix = isOutflow ? '-' : '+';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">{transaction.counterparty_name}</h4>
          <p className="text-xs text-gray-500">{new Date(transaction.timestamp).toLocaleString()}</p>
        </div>
        <div className={`text-sm font-bold ${amountColor}`}>
          {amountPrefix}{transaction.currency} {transaction.amount.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        <div>
          <span className="font-medium text-gray-500">Type:</span> {transaction.payment_channel}
        </div>
        <div>
           <span className="font-medium text-gray-500">Country:</span> {transaction.counterparty_country}
        </div>
        <div className="col-span-2 truncate">
          <span className="font-medium text-gray-500">Ref:</span> {transaction.description}
        </div>
      </div>

      {finding && (
        <div className="mt-3 pt-3 border-t border-gray-100 bg-gray-50 -mx-4 -mb-4 px-4 py-3 rounded-b-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-700">AI Analysis</span>
            <RiskBadge level={finding.risk_level} />
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-relaxed">{finding.reasoning}</p>
          
          <div className="flex flex-wrap gap-1 mb-2">
             {finding.flags.map((flag, idx) => (
               <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-100">
                 {flag.replace(/_/g, ' ')}
               </span>
             ))}
          </div>

          <div className="mt-2 text-xs">
            <span className="font-semibold text-gray-700">Action: </span>
            <span className="text-indigo-700 font-medium">{finding.recommended_action}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
