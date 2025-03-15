# Group ID: 24-25J-131

# Smart-Vote

Smart-Vote is a Blockchain-based Secure Voting System. A secure and transparent voting system is a fundamental necessity in any democratic process to ensure the integrity and credibility of elections. The integration of blockchain technology with advanced biometric verification mechanisms has emerged as a revolutionary approach to address the security challenges and inefficiencies of traditional voting systems. Blockchain, known for its decentralized, immutable, and transparent nature, provides an optimal solution for secure data storage and real-time monitoring, thereby mitigating risks such as voter fraud, tampering, and data manipulation.

In conventional voting systems, issues such as voter impersonation, ballot manipulation, and delayed result reporting have posed significant threats to election integrity. Moreover, the lack of accessibility features for disabled individuals and limited surveillance mechanisms further hinder the fairness and transparency of the electoral process. Thus, the need for an innovative and robust voting system is of paramount importance.

The proposed blockchain-based secure voting system leverages cutting-edge technologies such as machine learning for biometric verification, real-time surveillance, and predictive analytics to enhance election transparency and voter participation. The system ensures that only eligible voters can cast their votes through secure biometric data collection and verification processes, including fingerprint and facial recognition. The biometric data is securely stored on the blockchain, ensuring immutability and privacy protection.

Furthermore, the system features an intuitive and accessible user interface with multi-language support and specialized functionalities for individuals with disabilities. Real-time surveillance using Convolutional Neural Network (CNN) and Long Short-Term Memory (LSTM) algorithms is integrated to detect potential threats at polling stations and provide instant alerts to authorities. Additionally, the system enables real-time reporting of voter turnout, candidate standings, and demographic analytics, ensuring transparency and accountability throughout the voting process.

The predictive analytics component leverages historical data and social media sentiment analysis to forecast election outcomes and voter behavior, aiding administrators and policymakers in making informed decisions. The platform also offers an admin dashboard for managing candidates, generating custom reports, and visualizing voting patterns.

This blockchain-based secure voting system not only addresses the current inefficiencies and vulnerabilities in traditional voting methods but also fosters trust, transparency, and inclusivity in the democratic process. By integrating advanced technologies, the system empowers voters and administrators alike, ensuring a fair and secure electoral environment.

## Project Functionalities and Responsibilities

The Smart-Vote system consists of four key functionalities, each handled by a team member:

1. **Voter Registration and Verification**  
   **Unique Feature:** Biometric Data Collection and Verification  
   **Handled by:** Abeykoon A.M.P.N  
   This module ensures the secure and accurate registration of voters by collecting biometric data such as fingerprints and facial recognition. The collected biometric data is securely stored on the blockchain to prevent tampering and ensure voter authenticity.

2. **Secure Voting Interface**  
   **Unique Feature:** Multi-Language Support (Smart Contract)  
   **Handled by:** Dilshan N.M  
   This module provides an accessible and user-friendly voting interface with multi-language support. The voting process is secured using blockchain-based smart contracts to ensure transparency and reliability.

3. **Real-Time Vote Counting and Fraud Detection**  
   **Unique Feature:** Fraud Detection and Anomaly Reporting  
   **Handled by:** Dilshan K.H.T  
   This module is responsible for real-time vote counting and fraud detection. Using anomaly detection algorithms, it identifies suspicious activities such as duplicate voting and manipulation attempts, ensuring a fair electoral process.

4. **Election Result Analysis and Reporting**  
   **Unique Feature:** Predictive Analytics (Historical Data and Social Media Sentiment)  
   **Handled by:** Saranasuriya N.V  
   This module analyzes election results using historical voting data and social media sentiment analysis. Predictive analytics help forecast election outcomes and provide valuable insights for policymakers.

## Team Members

| Name                        | Student ID  | University Email                | Personal Email                      |
|-----------------------------|-------------|----------------------------------|--------------------------------------|
| Abeykoon A.M.P.N           | IT21263262  | [it21263262@my.sliit.lk](mailto:it21263262@my.sliit.lk) | [piyumiabeykoon1619@gmail.com](mailto:piyumiabeykoon1619@gmail.com) |
| Dilshan N.M                 | IT21196324  | [it21196324@my.sliit.lk](mailto:it21196324@my.sliit.lk) | [maleeshahirug@gmail.com](mailto:maleeshahirug@gmail.com) |
| Dilshan K.H.T               | IT21259098  | [it21259098@my.sliit.lk](mailto:it21259098@my.sliit.lk) | [tharushad2001@gmail.com](mailto:tharushad2001@gmail.com) |
| Saranasuriya N.V            | IT21310478  | [it21310478@my.sliit.lk](mailto:it21310478@my.sliit.lk) | [nethumvishwadinu@gmail.com](mailto:nethumvishwadinu@gmail.com) |

## How to Set Up and Run the Project

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/smart-vote.git
   cd smart-vote
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Start the application:**
   ```sh
   npm start
   ```
4. **Smart contract deployment:**
   ```sh
   truffle migrate --network development
   ```
5. **Run the blockchain network:**
   ```sh
   ganache-cli
   ```

## Technologies Used
- **Blockchain:** Ethereum, Solidity, Smart Contracts
- **Machine Learning:** CNN, LSTM for fraud detection and predictive analytics
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Biometric Verification (Fingerprint, Facial Recognition)
- **Predictive Analytics:** Social Media Sentiment Analysis, Historical Data Analysis








