from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

db = SessionLocal()

def seed_data():
    # Mock Lawyers
    lawyers = [
        models.Lawyer(
            id='1',
            name='Sarah Johnson',
            email='sarah.johnson@email.com',
            role='lawyer',
            status='active',
            specialization=['Criminal Law', 'Family Law'],
            experience=8,
            rating=4.8,
            casesHandled=156,
            availability='online',
            verified=True,
            createdAt='2024-01-15',
            documents=[
                {'id': '1', 'name': 'Bar Certificate.pdf', 'type': 'PDF', 'uploadedAt': '2024-01-15', 'size': '2.5 MB'}
            ]
        ),
        models.Lawyer(
            id='2',
            name='Michael Chen',
            email='michael.chen@email.com',
            role='lawyer',
            status='active',
            specialization=['Corporate Law', 'IP Law'],
            experience=12,
            rating=4.9,
            casesHandled=203,
            availability='busy',
            verified=True,
            createdAt='2023-11-20',
            documents=[]
        ),
        models.Lawyer(
            id='3',
            name='Emily Rodriguez',
            email='emily.rodriguez@email.com',
            role='lawyer',
            status='pending',
            specialization=['Immigration Law'],
            experience=5,
            rating=4.6,
            casesHandled=89,
            availability='offline',
            verified=False,
            createdAt='2024-12-01',
            documents=[]
        ),
        # New Lawyers from User Screenshot
        models.Lawyer(
            id='kunal_patel',
            name='Adv. Kunal Patel',
            email='kunal.patel@advocates.in',
            role='lawyer',
            status='active',
            specialization=['Real Estate Law', 'Property Disputes'],
            experience=5,
            rating=0,
            casesHandled=0,
            availability='offline',
            verified=True,
            createdAt='2024-01-01',
            documents=[]
        ),
        models.Lawyer(
            id='rohan_mehta',
            name='Adv. Rohan Mehta',
            email='rohan.mehta@lawmail.com',
            role='lawyer',
            status='active',
            specialization=['Criminal Law', 'Civil Law'],
            experience=8,
            rating=0,
            casesHandled=0,
            availability='online',
            verified=True,
            createdAt='2024-01-02',
            documents=[]
        ),
         models.Lawyer(
            id='neha_sharma',
            name='Adv. Neha Sharma',
            email='neha.sharma@legalpro.in',
            role='lawyer',
            status='active',
            specialization=['Family Law', 'Divorce', 'Child Custody'],
            experience=4,
            rating=0,
            casesHandled=0,
            availability='online',
            verified=True,
            createdAt='2024-01-03',
            documents=[]
        )
    ]
    
    # Mock Clients
    clients = [
        models.Client(
            id='1',
            name='John Smith',
            email='john.smith@email.com',
            role='client',
            status='active',
            consultations=3,
            booksDownloaded=2,
            articlesRead=15,
            totalSpent=850,
            createdAt='2024-02-10'
        ),
        models.Client(
            id='2',
            name='Lisa Wang',
            email='lisa.wang@email.com',
            role='client',
            status='active',
            consultations=1,
            booksDownloaded=5,
            articlesRead=23,
            totalSpent=320,
            createdAt='2024-03-05'
        ),
        models.Client(
            id='3',
            name='David Brown',
            email='david.brown@email.com',
            role='client',
            status='inactive',
            consultations=0,
            booksDownloaded=1,
            articlesRead=7,
            totalSpent=45,
            createdAt='2024-01-28'
        )
    ]

    # Mock Cases
    cases = [
        models.Case(
            id='1',
            title='Personal Injury Claim',
            clientId='1',
            lawyerId='1',
            status='in-progress',
            stage='Discovery',
            priority='high',
            createdAt='2024-11-15',
            nextHearing='2024-12-20',
            documents=[
                {'id': '1', 'name': 'Medical Records.pdf', 'type': 'PDF', 'uploadedAt': '2024-11-16', 'size': '5.2 MB'},
                {'id': '2', 'name': 'Incident Report.docx', 'type': 'DOCX', 'uploadedAt': '2024-11-17', 'size': '1.8 MB'}
            ]
        ),
        models.Case(
            id='2',
            title='Contract Dispute',
            clientId='2',
            lawyerId='2',
            status='open',
            stage='Initial Review',
            priority='medium',
            createdAt='2024-12-01',
            documents=[]
        ),
        models.Case(
            id='3',
            title='Immigration Appeal',
            clientId='3',
            lawyerId='3',
            status='closed',
            stage='Completed',
            priority='low',
            createdAt='2024-10-05',
            documents=[]
        ),
        # Case for Kunal
         models.Case(
            id='4',
            title='Property Title Dispute',
            clientId='1',
            lawyerId='kunal_patel',
            status='in-progress',
            stage='Mediation',
            priority='high',
            createdAt='2025-01-10',
            nextHearing='2025-01-25',
            documents=[]
        )
    ]

    # Mock Appointments
    appointments = [
        models.Appointment(
            id='1',
            clientName='John Smith',
            lawyerName='Sarah Johnson',
            lawyerId='1',  # Added ID for linking
            clientId='1',
            date='2024-12-18',
            time='14:00',
            type='consultation',
            status='pending',
            notes='Initial consultation for personal injury case'
        ),
        models.Appointment(
            id='2',
            clientName='Lisa Wang',
            lawyerName='Michael Chen',
            lawyerId='2',
            clientId='2',
            date='2024-12-19',
            time='10:30',
            type='hearing',
            status='approved'
        ),
        models.Appointment(
            id='3',
            clientName='David Brown',
            lawyerName='Emily Rodriguez',
            lawyerId='3',
            clientId='3',
            date='2024-12-17',
            time='16:00',
            type='meeting',
            status='completed'
        ),
        # Appointments for Kunal Patel
        models.Appointment(
            id='4',
            clientName='John Smith',
            lawyerName='Adv. Kunal Patel',
            lawyerId='kunal_patel',
            clientId='1',
            date='2025-01-25',
            time='11:00',
            type='consultation',
            status='approved',
            notes='Property dispute discussion'
        ),
         models.Appointment(
            id='5',
            clientName='Lisa Wang',
            lawyerName='Adv. Kunal Patel',
            lawyerId='kunal_patel',
            clientId='2',
            date='2025-01-26',
            time='14:00',
            type='consultation',
            status='pending',
            notes='New inquiry for real estate'
        )
    ]
    
    # Mock Reviews
    reviews = [
        models.Review(
            id='1',
            name="Sarah Jenkins",
            role="Business Owner",
            content="LegalWise made finding a corporate lawyer incredibly easy. The detailed profiles and client reviews helped me choose the perfect match for my startup.",
            rating=5,
            image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
            createdAt='2023-12-10'
        ),
        models.Review(
            id='2',
            name="Michael Chen",
            role="Real Estate Investor",
            content="I needed urgent advice on a property dispute. The 'Find Lawyer' feature connected me with a local expert within minutes. Highly recommended!",
            rating=5,
            image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            createdAt='2024-01-05'
        ),
        models.Review(
            id='3',
            name="Emily Rodriguez",
            role="Freelancer",
            content="The legal articles and books section provided me with so much clarity before I even spoke to a lawyer. It's a comprehensive platform for anyone.",
            rating=4,
            image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
            createdAt='2024-01-20'
        )
    ]

    # Clear existing data?
    # db.query(models.Lawyer).delete()
    # db.query(models.Client).delete()
    # db.query(models.Case).delete()
    # db.query(models.Appointment).delete()

    from routers.common.auth import get_password_hash
    
    # Add new data
    for lawyer in lawyers:
        # Default password for seeds
        if not hasattr(lawyer, 'hashed_password') or not lawyer.hashed_password:
             lawyer.hashed_password = get_password_hash("12345678")
        db.merge(lawyer) # merge allows upsert if id exists
        
    for client in clients:
        if not hasattr(client, 'hashed_password') or not client.hashed_password:
             client.hashed_password = get_password_hash("12345678")
        db.merge(client)
        
    for case in cases:
        db.merge(case)
    for appointment in appointments:
        db.merge(appointment)
        
    for review in reviews:
        db.merge(review)
        
    db.commit()
    print("Database seeded successfully!")

if __name__ == "__main__":
    models.Base.metadata.create_all(bind=engine)
    seed_data()
